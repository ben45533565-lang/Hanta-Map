"use client";

import { Newspaper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SOURCE_ICONS = {
  "AP": "/news-icons/ap.png",
  "AP News": "/news-icons/ap.png",
  "Associated Press": "/news-icons/ap.png",
  "BBC": "/news-icons/bbc.png",
  "BBC News": "/news-icons/bbc.png",
  "CBS News": "/news-icons/cbs.png",
  "CNN": "/news-icons/cnn.png",
  "NBC News": "/news-icons/nbc.png",
  "NPR": "/news-icons/npr.png",
  "PBS": "/news-icons/pbs.png",
  "Reuters": "/news-icons/reuters.png",
  "Sky News": "/news-icons/sky.png",
  "The Conversation": "/news-icons/conversation.png",
  "The Economist": "/news-icons/economist.png",
  "Euronews": "/news-icons/euronews.png",
  "France 24": "/news-icons/france24.png",
  "UN News": "/news-icons/un.png",
  "The Guardian": "/news-icons/guardian.png",
  "The Independent": "/news-icons/independent.png",
  "The New York Times": "/news-icons/nyt.png",
  "New York Times": "/news-icons/nyt.png",
  "The Wall Street Journal": "/news-icons/wsj.png",
  "Wall Street Journal": "/news-icons/wsj.png",
  "WSJ": "/news-icons/wsj.png",
  "The Washington Post": "/news-icons/washingtonpost.png",
  "Washington Post": "/news-icons/washingtonpost.png"
};

function formatStamp(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "--/--/----, --:--:--";
  }

  const zone =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value || "";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${zone}`.trim();
}

function iconForSource(item) {
  return SOURCE_ICONS[item.source] || "";
}

function sourceInitials(source = "News") {
  return source
    .replace(/^The\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function MainstreamNews({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [updatedAt, setUpdatedAt] = useState("");
  const [state, setState] = useState("static");

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        const response = await fetch("/api/news", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`News proxy returned ${response.status}`);
        }

        const payload = await response.json();
        if (!active || !Array.isArray(payload.items) || payload.items.length === 0) {
          return;
        }

        setItems(payload.items);
        setUpdatedAt(payload.fetchedAt || new Date().toISOString());
        setState(payload.stale ? "stale" : "live");
      } catch {
        if (active) {
          setState("static");
          setUpdatedAt(new Date().toISOString());
        }
      }
    }

    loadNews();
    const interval = window.setInterval(loadNews, 15 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const visibleItems = useMemo(() => items.slice(0, 16), [items]);
  const rollingItems = useMemo(
    () => (visibleItems.length > 5 ? [...visibleItems, ...visibleItems] : visibleItems),
    [visibleItems]
  );
  const feedLabel = state === "live" ? "Live feed" : state === "stale" ? "Cached feed" : "Static feed";

  return (
    <section className="panel headline-panel">
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">
            <Newspaper size={18} />
          </span>
          <div>
            <h2>Mainstream News</h2>
            <p>Auto-refreshed headlines from mainstream reporting</p>
          </div>
        </div>
        <span className={`last-updated headline-sync ${state}`}>
          <span>{feedLabel}</span>
          <em>{visibleItems.length} headlines / 15m refresh</em>
          <time>{formatStamp(updatedAt)}</time>
        </span>
      </div>
      <div className="headline-roll-window" aria-label={`${feedLabel}: ${visibleItems.length} mainstream headlines`}>
        <div className={`headline-list ${visibleItems.length > 5 ? "rolling" : ""}`}>
          {rollingItems.map((item, index) => (
            <a
              className="headline-item"
              href={item.url}
              key={`${item.source}-${item.headline}-${index}`}
              rel="noreferrer"
              target="_blank"
            >
              <span className="headline-source-icon" aria-hidden="true">
                {iconForSource(item) ? <img src={iconForSource(item)} alt="" loading="lazy" /> : sourceInitials(item.source)}
              </span>
              <span className="headline-copy">
                <span className="headline-meta">
                  <strong>{item.source}</strong>
                  <em>{item.tag}</em>
                  <time>{item.date}</time>
                </span>
                <span className="headline-title">{item.headline}</span>
                <small>{item.summary}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
