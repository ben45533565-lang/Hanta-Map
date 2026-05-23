#!/usr/bin/env python3

import fcntl
import hashlib
import html
import hmac
import ipaddress
import json
import os
import re
import threading
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from urllib.parse import urlparse

HOST = os.environ.get("HANTA_COUNTER_HOST", "0.0.0.0")
PORT = int(os.environ.get("HANTA_COUNTER_PORT", "8787"))
DATA_DIR = Path(__file__).resolve().parent / "hanta-watch"
COUNT_FILE = DATA_DIR / "view-counter.txt"
LOCK_FILE = DATA_DIR / "view-counter.lock"
UNIQUE_FILE = DATA_DIR / "view-counter-unique-hashes.txt"
SECRET_FILE = DATA_DIR / "view-counter-secret"
POLYMARKET_URL = os.environ.get(
    "HANTA_POLYMARKET_URL",
    "https://gamma-api.polymarket.com/events/slug/hantavirus-pandemic-in-2026",
)
POLYMARKET_TTL = int(os.environ.get("HANTA_POLYMARKET_TTL", "120"))
NEWS_TTL = int(os.environ.get("HANTA_NEWS_TTL", "900"))
NEWS_LIMIT = int(os.environ.get("HANTA_NEWS_LIMIT", "16"))
SITE_ORIGIN = os.environ.get("HANTA_SITE_ORIGIN", "https://hanta.bandors.org")
MAX_POST_BYTES = int(os.environ.get("HANTA_MAX_POST_BYTES", "1024"))
MAX_UPSTREAM_BYTES = int(os.environ.get("HANTA_MAX_UPSTREAM_BYTES", "1048576"))
NEWS_FEEDS = [
    {
        "url": "https://news.google.com/rss/search?q=%28hantavirus%20OR%20%22MV%20Hondius%22%20OR%20%22Andes%20virus%22%29%20when%3A14d&hl=en-US&gl=US&ceid=US:en",
        "source": None,
    },
    {
        "url": "https://news.google.com/rss/search?q=%22hantavirus%22%20%22cruise%20ship%22%20when%3A14d&hl=en-US&gl=US&ceid=US:en",
        "source": None,
    },
    {
        "url": "https://news.google.com/rss/search?q=%22MV%20Hondius%22%20when%3A14d&hl=en-US&gl=US&ceid=US:en",
        "source": None,
    },
    {"url": "https://feeds.skynews.com/feeds/rss/world.xml", "source": "Sky News"},
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "source": "BBC"},
    {"url": "https://www.theguardian.com/world/rss", "source": "The Guardian"},
    {"url": "https://www.cbsnews.com/latest/rss/world", "source": "CBS News"},
]
NEWS_KEYWORDS = (
    "hantavirus",
    "hantaviruses",
    "andes virus",
    "mv hondius",
    "hondius",
    "cruise ship",
)
MAINSTREAM_SOURCES = {
    "ABC News",
    "AP News",
    "Associated Press",
    "BBC",
    "BBC News",
    "CBS News",
    "CNN",
    "The Conversation",
    "The Economist",
    "Euronews",
    "France 24",
    "NBC News",
    "New York Times",
    "NPR",
    "PBS",
    "Reuters",
    "Scientific American",
    "Sky News",
    "The Associated Press",
    "The Guardian",
    "The Independent",
    "The New York Times",
    "The Wall Street Journal",
    "The Washington Post",
    "UN News",
    "Wall Street Journal",
    "Washington Post",
    "WSJ",
}

_polymarket_lock = threading.Lock()
_polymarket_cache = {"expires": 0, "payload": None}
_news_lock = threading.Lock()
_news_cache = {"expires": 0, "payload": None}
_unique_hashes = None


def ensure_store():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not COUNT_FILE.exists():
        COUNT_FILE.write_text("0\n", encoding="utf-8")
    if not UNIQUE_FILE.exists():
        UNIQUE_FILE.write_text("", encoding="utf-8")
    if not SECRET_FILE.exists():
        SECRET_FILE.write_text(os.urandom(32).hex(), encoding="utf-8")
    os.chmod(SECRET_FILE, 0o600)
    os.chmod(UNIQUE_FILE, 0o600)


def read_count_unlocked():
    try:
        return int(COUNT_FILE.read_text(encoding="utf-8").strip() or "0")
    except ValueError:
        return 0


def write_count_unlocked(count):
    temp_file = COUNT_FILE.with_suffix(".tmp")
    temp_file.write_text(f"{count}\n", encoding="utf-8")
    os.replace(temp_file, COUNT_FILE)


def update_count(increment=False):
    ensure_store()
    with LOCK_FILE.open("w", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        count = read_count_unlocked()

        if increment:
            count += 1
            write_count_unlocked(count)

        return count


def load_unique_hashes_locked():
    global _unique_hashes

    if _unique_hashes is None:
        ensure_store()
        _unique_hashes = {
            line.strip()
            for line in UNIQUE_FILE.read_text(encoding="utf-8").splitlines()
            if line.strip()
        }

    return _unique_hashes


def normalize_ip(value):
    candidate = (value or "").strip()
    if not candidate:
        return ""

    if candidate.startswith("[") and "]" in candidate:
        candidate = candidate[1 : candidate.index("]")]
    elif candidate.count(":") == 1 and "." in candidate:
        candidate = candidate.rsplit(":", 1)[0]

    try:
        return ipaddress.ip_address(candidate).compressed
    except ValueError:
        return candidate.lower()


def valid_ip(value):
    normalized = normalize_ip(value)
    if not normalized:
        return ""

    try:
        return ipaddress.ip_address(normalized).compressed
    except ValueError:
        return ""


def header_list_ip(value):
    for part in reversed((value or "").split(",")):
        ip = valid_ip(part)
        if ip:
            return ip

    return ""


def visitor_fingerprint(ip_value):
    ensure_store()
    ip = normalize_ip(ip_value)
    if not ip:
        return ""

    secret = SECRET_FILE.read_text(encoding="utf-8").strip().encode("utf-8")
    return hmac.new(secret, ip.encode("utf-8"), hashlib.sha256).hexdigest()


def safe_http_url(value):
    if not value:
        return ""

    try:
        parsed = urlparse(value.strip())
    except ValueError:
        return ""

    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return ""

    return value.strip()


def read_limited_response(response, limit=MAX_UPSTREAM_BYTES):
    data = response.read(limit + 1)
    if len(data) > limit:
        raise URLError("upstream_response_too_large")
    return data


def unique_count_for(ip_value):
    fingerprint = visitor_fingerprint(ip_value)
    if not fingerprint:
        return update_count(increment=False)

    ensure_store()
    with LOCK_FILE.open("w", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        known = load_unique_hashes_locked()
        if fingerprint in known:
            return read_count_unlocked()

        count = read_count_unlocked() + 1
        write_count_unlocked(count)
        with UNIQUE_FILE.open("a", encoding="utf-8") as unique_file:
            unique_file.write(f"{fingerprint}\n")
        known.add(fingerprint)
        return count


def parse_list(value):
    if isinstance(value, list):
        return value

    if not value:
        return []

    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return []


def parse_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def percent_from_price(value):
    number = parse_float(value)
    if number is None:
        return None
    return round(number * 100, 1)


def normalize_polymarket(data):
    market = (data.get("markets") or [{}])[0]
    outcomes = parse_list(market.get("outcomes"))
    prices = [parse_float(price) for price in parse_list(market.get("outcomePrices"))]

    def outcome_price(label):
        try:
            index = outcomes.index(label)
        except ValueError:
            return None

        if index >= len(prices):
            return None
        return prices[index]

    yes_price = outcome_price("Yes")
    no_price = outcome_price("No")

    if yes_price is None:
        yes_price = parse_float(market.get("lastTradePrice"))

    if no_price is None and yes_price is not None:
        no_price = 1 - yes_price

    return {
        "eventTitle": data.get("title") or "Hantavirus pandemic in 2026?",
        "question": market.get("question") or data.get("title") or "Hantavirus pandemic in 2026?",
        "updatedAt": market.get("updatedAt") or data.get("updatedAt"),
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "https://polymarket.com/event/hantavirus-pandemic-in-2026",
        "yes": {
            "label": "Yes",
            "price": yes_price,
            "percent": percent_from_price(yes_price),
        },
        "no": {
            "label": "No",
            "price": no_price,
            "percent": percent_from_price(no_price),
        },
        "metrics": {
            "bestBid": parse_float(market.get("bestBid")),
            "bestAsk": parse_float(market.get("bestAsk")),
            "lastTradePrice": parse_float(market.get("lastTradePrice")),
            "volume": parse_float(market.get("volume")),
            "volume24hr": parse_float(market.get("volume24hr")),
            "liquidity": parse_float(market.get("liquidity")),
        },
        "stale": False,
    }


def get_polymarket_payload():
    now = time.time()

    with _polymarket_lock:
        cached = _polymarket_cache["payload"]
        if cached and now < _polymarket_cache["expires"]:
            return cached

        request = Request(
            POLYMARKET_URL,
            headers={
                "Accept": "application/json",
                "User-Agent": "hanta-watch/1.0 (+https://hanta.bandors.org)",
            },
        )

        try:
            with urlopen(request, timeout=8) as response:
                payload = normalize_polymarket(json.loads(read_limited_response(response).decode("utf-8")))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
            cached = _polymarket_cache["payload"]
            if cached:
                stale_payload = dict(cached)
                stale_payload["stale"] = True
                stale_payload["error"] = str(error)
                return stale_payload
            raise

        _polymarket_cache["payload"] = payload
        _polymarket_cache["expires"] = now + POLYMARKET_TTL
        return payload


def strip_html(value):
    text = re.sub(r"<[^>]+>", " ", html.unescape(value or ""))
    return re.sub(r"\s+", " ", text).strip()


def keyword_match(*values):
    text = " ".join(value or "" for value in values).lower()
    return any(keyword in text for keyword in NEWS_KEYWORDS)


def generic_news_roundup(title):
    lowered = (title or "").lower()
    return bool(re.match(r"^\d{1,2}/\d{1,2}:", title or "")) or any(
        phrase in lowered
        for phrase in (
            "evening news",
            "news wrap",
            "the takeout",
            "full episode",
        )
    )


def parse_datetime(value):
    if not value:
        return None

    try:
        parsed = parsedate_to_datetime(value)
    except (TypeError, ValueError, IndexError, OverflowError):
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def text_for(item, name):
    child = item.find(name)
    return child.text.strip() if child is not None and child.text else ""


def source_for(item, fallback):
    source = text_for(item, "source") or fallback or ""
    return source.strip() or "News"


def source_url_for(item, feed):
    source = item.find("source")
    if source is not None:
        url = source.attrib.get("url") or ""
        if url:
            return url.strip()

    return feed.get("sourceUrl") or feed.get("url") or ""


def tag_for(source, title):
    text = f"{source} {title}".lower()
    if "timeline" in text:
        return "TIMELINE"
    if "evacuat" in text:
        return "EVAC"
    if "trace" in text or "monitor" in text:
        return "TRACE"
    if "what is" in text or "explainer" in text:
        return "EXPLAINER"
    if "sky" in text or "ap" in text or "reuters" in text:
        return "WIRE"
    return "NEWS"


def normalize_news_title(title, source):
    cleaned = strip_html(title)
    if source and cleaned.lower().endswith(f" - {source}".lower()):
        cleaned = cleaned[: -(len(source) + 3)].strip()
    return cleaned


def fetch_news_feed(feed):
    request = Request(
        feed["url"],
        headers={
            "Accept": "application/rss+xml, application/xml, text/xml",
            "User-Agent": "hanta-watch/1.0 (+https://hanta.bandors.org)",
        },
    )

    with urlopen(request, timeout=8) as response:
        root = ET.fromstring(read_limited_response(response))

    items = []
    for item in root.findall(".//item"):
        raw_title = text_for(item, "title")
        raw_summary = text_for(item, "description")
        source = source_for(item, feed.get("source"))
        source_url = source_url_for(item, feed)
        title = normalize_news_title(raw_title, source)
        summary = strip_html(raw_summary)
        url = safe_http_url(text_for(item, "link"))
        published = parse_datetime(text_for(item, "pubDate"))

        if not title or not url or generic_news_roundup(title) or not keyword_match(title, summary):
            continue

        if feed.get("source") is None and source not in MAINSTREAM_SOURCES:
            continue

        items.append(
            {
                "source": source,
                "date": published.date().isoformat() if published else "",
                "publishedAt": published.isoformat().replace("+00:00", "Z") if published else None,
                "tag": tag_for(source, title),
                "headline": title,
                "summary": summary[:210],
                "url": url,
                "sourceUrl": source_url,
            }
        )

    return items


def dedupe_news(items):
    seen = set()
    deduped = []
    for item in sorted(items, key=lambda entry: entry.get("publishedAt") or "", reverse=True):
        key = re.sub(r"[^a-z0-9]+", " ", item["headline"].lower()).strip()
        key = " ".join(key.split()[:12])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    return deduped


def get_news_payload():
    now = time.time()

    with _news_lock:
        cached = _news_cache["payload"]
        if cached and now < _news_cache["expires"]:
            return cached

        items = []
        errors = []
        for feed in NEWS_FEEDS:
            try:
                items.extend(fetch_news_feed(feed))
            except (HTTPError, URLError, TimeoutError, ET.ParseError) as error:
                errors.append(f"{feed['url']}: {error}")

        items = dedupe_news(items)[:NEWS_LIMIT]
        if not items:
            cached = _news_cache["payload"]
            if cached:
                stale_payload = dict(cached)
                stale_payload["stale"] = True
                stale_payload["errors"] = errors
                return stale_payload
            raise URLError("no_news_items")

        payload = {
            "items": items,
            "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "ttl": NEWS_TTL,
            "stale": False,
            "errors": errors,
        }

        _news_cache["payload"] = payload
        _news_cache["expires"] = now + NEWS_TTL
        return payload


class CounterHandler(BaseHTTPRequestHandler):
    server_version = "HantaWatch"
    sys_version = ""

    def visitor_ip(self):
        real_ip = valid_ip(self.headers.get("X-Real-IP", ""))
        if real_ip:
            return real_ip

        forwarded_for = header_list_ip(self.headers.get("X-Forwarded-For", ""))
        if forwarded_for:
            return forwarded_for

        return valid_ip(self.client_address[0]) if self.client_address else ""

    def request_origin(self):
        origin = self.headers.get("Origin", "")
        return origin if origin == SITE_ORIGIN else ""

    def send_cors_headers(self):
        origin = self.request_origin()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

    def request_body_too_large(self):
        try:
            length = int(self.headers.get("Content-Length", "0") or "0")
        except ValueError:
            return True

        return length > MAX_POST_BYTES

    def do_HEAD(self):
        path = self.path.split("?", 1)[0]

        if path == "/api/view-counter":
            self.respond_empty(cache_control="no-store")
            return

        if path == "/api/polymarket":
            self.respond_empty(cache_control="public, max-age=60")
            return

        if path == "/api/news":
            self.respond_empty(cache_control="public, max-age=300")
            return

        self.send_error(404)

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        if path == "/api/view-counter":
            self.respond_json({"count": update_count(increment=False)}, cache_control="no-store")
            return

        if path == "/api/polymarket":
            try:
                self.respond_json(get_polymarket_payload(), cache_control="public, max-age=60")
            except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
                self.respond_json({"error": "polymarket_unavailable"}, status=502, cache_control="no-store")
            return

        if path == "/api/news":
            try:
                self.respond_json(get_news_payload(), cache_control="public, max-age=300")
            except (HTTPError, URLError, TimeoutError):
                self.respond_json({"error": "news_unavailable"}, status=502, cache_control="no-store")
            return

        self.send_error(404)

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/view-counter":
            self.send_error(404)
            return

        if self.headers.get("Origin") and not self.request_origin():
            self.respond_json({"error": "origin_forbidden"}, status=403, cache_control="no-store")
            return

        if self.request_body_too_large():
            self.respond_json({"error": "request_too_large"}, status=413, cache_control="no-store")
            return

        self.respond_json({"count": unique_count_for(self.visitor_ip())}, cache_control="no-store")

    def do_OPTIONS(self):
        if self.headers.get("Origin") and not self.request_origin():
            self.respond_empty(status=403, cache_control="no-store")
            return

        self.send_response(204)
        self.send_cors_headers()
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Accept, Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.end_headers()

    def respond_empty(self, status=200, cache_control="no-store"):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", cache_control)
        self.send_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def respond_json(self, data, status=200, cache_control="no-store"):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", cache_control)
        self.send_cors_headers()
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        try:
            self.wfile.write(payload)
        except (BrokenPipeError, ConnectionResetError):
            pass
    def log_message(self, format, *args):
        pass
if __name__ == "__main__":
    ensure_store()
    
    # Render'ın verdiği portu al, yoksa 10000 kullan
        render_port = int(os.environ.get("PORT", 10000))
    
    print(f"Sunucu zorunlu olarak 0.0.0.0:{render_port} üzerinde baslatiliyor...")
    
    # Buradaki HOST değişkeni yerine direkt "0.0.0.0" yazarak localhost inadını kırıyoruz:
        ThreadingHTTPServer(("0.0.0.0", render_port), CounterHandler).serve_forever()

