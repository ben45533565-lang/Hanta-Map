"use client";

import { ExternalLink, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const polymarketUrl = "https://polymarket.com/event/hantavirus-pandemic-in-2026";

const fallbackMarket = {
  eventTitle: "Hantavirus pandemic in 2026?",
  question: "Hantavirus pandemic in 2026?",
  updatedAt: null,
  source: polymarketUrl,
  yes: {
    label: "Yes",
    price: 0.0965,
    percent: 9.7,
  },
  no: {
    label: "No",
    price: 0.9035,
    percent: 90.3,
  },
  metrics: {
    bestBid: 0.096,
    bestAsk: 0.097,
    lastTradePrice: 0.097,
    volume: 2604843,
    volume24hr: 2073189,
    liquidity: 1120531,
  },
  stale: true,
};

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function formatPrice(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${Math.round(value * 1000) / 10}c`;
}

function formatUsd(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }

  return `$${value.toFixed(0)}`;
}

function formatTimestamp(value) {
  if (!value) {
    return "Pending";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Pending";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function PolymarketOdds() {
  const [market, setMarket] = useState(fallbackMarket);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let active = true;

    async function loadMarket() {
      try {
        const response = await fetch("/api/polymarket", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Polymarket proxy returned ${response.status}`);
        }

        const payload = await response.json();
        if (!active) {
          return;
        }

        setMarket({
          ...fallbackMarket,
          ...payload,
          yes: { ...fallbackMarket.yes, ...payload.yes },
          no: { ...fallbackMarket.no, ...payload.no },
          metrics: { ...fallbackMarket.metrics, ...payload.metrics },
        });
        setState(payload.stale ? "stale" : "live");
      } catch {
        if (active) {
          setState("fallback");
        }
      }
    }

    loadMarket();
    const interval = window.setInterval(loadMarket, 120000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const yesPercent = clampPercent(market.yes?.percent);
  const noPercent = clampPercent(market.no?.percent);
  const updatedAt = useMemo(() => formatTimestamp(market.updatedAt), [market.updatedAt]);

  return (
    <section className="panel polymarket-panel">
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon amber-icon">
            <TrendingUp size={18} />
          </span>
          <div>
            <h2>Polymarket Odds</h2>
            <p>Live prediction market signal for pandemic resolution odds</p>
          </div>
        </div>
        <a className="polymarket-source" href={market.source || polymarketUrl} rel="noreferrer" target="_blank">
          Market <ExternalLink size={14} />
        </a>
      </div>

      <div className="polymarket-body">
        <div className="polymarket-market-card">
          <div className="polymarket-question">
            <span>{market.eventTitle}</span>
            <strong>{market.question}</strong>
          </div>

          <div className="polymarket-odds-grid">
            <div className="polymarket-outcome yes">
              <span>YES</span>
              <strong>{formatPercent(yesPercent)}</strong>
              <em>{formatPrice(market.yes?.price)}</em>
            </div>
            <div className="polymarket-outcome no">
              <span>NO</span>
              <strong>{formatPercent(noPercent)}</strong>
              <em>{formatPrice(market.no?.price)}</em>
            </div>
          </div>

          <div className="polymarket-meter" aria-label={`Yes ${formatPercent(yesPercent)}, No ${formatPercent(noPercent)}`}>
            <span className="polymarket-meter-yes" style={{ width: `${yesPercent}%` }} />
            <span className="polymarket-meter-no" style={{ width: `${noPercent}%` }} />
          </div>
        </div>

        <div className="polymarket-side">
          <div className={`polymarket-status ${state}`}>
            <span>{state === "live" ? "LIVE ODDS" : state === "stale" ? "STALE CACHE" : state === "loading" ? "SYNCING" : "FALLBACK"}</span>
            <time>{updatedAt}</time>
          </div>

          <div className="polymarket-metrics">
            <div>
              <span>24H VOL</span>
              <strong>{formatUsd(market.metrics?.volume24hr)}</strong>
            </div>
            <div>
              <span>LIQUIDITY</span>
              <strong>{formatUsd(market.metrics?.liquidity)}</strong>
            </div>
            <div>
              <span>LAST</span>
              <strong>{formatPrice(market.metrics?.lastTradePrice)}</strong>
            </div>
            <div>
              <span>SPREAD</span>
              <strong>
                {formatPrice(market.metrics?.bestBid)} / {formatPrice(market.metrics?.bestAsk)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
