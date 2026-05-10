"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

function formatElapsed(timestamp, now) {
  if (!timestamp || !now) {
    return "--:--:--";
  }

  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) {
    return "--:--:--";
  }

  const totalSeconds = Math.max(0, Math.floor((now - then) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export default function VirusTracker({ event, markers }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const confirmedElapsed = formatElapsed(event.confirmedUpdatedAt, now);

  return (
    <section className="event-card official-tracker">
      <div className="panel-header compact tracker-head">
        <div className="panel-title-row">
          <span className="panel-icon red">
            <AlertTriangle size={18} />
          </span>
          <div>
            <h2>{event.name}</h2>
            <p>{event.location}</p>
          </div>
        </div>

        <div className="tracker-header-right">
          <div className="tracker-status-strip">
            <div className="stat-tile stat-tile-updated">
              <strong>{event.confirmed}</strong>
              <span>
                Confirmed
                {event.confirmedDelta ? <em className="stat-delta">+{event.confirmedDelta}</em> : null}
              </span>
              <small suppressHydrationWarning>UPDATED {confirmedElapsed}</small>
            </div>
            <div className="stat-tile">
              <strong>{event.suspected}</strong>
              <span>Suspected</span>
            </div>
            <div className="stat-tile">
              <strong>{event.deaths}</strong>
              <span>Deaths</span>
            </div>
            <div className="stat-tile">
              <strong>{event.risk.replace("WHO PUBLIC RISK: ", "")}</strong>
              <span>Current WHO risk</span>
            </div>
          </div>
          <span className="badge red">LIVE</span>
        </div>
      </div>

      <div className="tracker-stage">
        <div className="tracker-sky" />
        <div className="tracker-water">
          <span className="wave wave-a" />
          <span className="wave wave-b" />
          <span className="wave wave-c" />
        </div>

        <div className="boat-button mv-hondius" aria-hidden="true">
          <span className="ship-wake wake-left" />
          <span className="ship-wake wake-right" />
          <span className="ship-nameplate">MV HONDIUS</span>
          <span className="ship-antenna" />
          <span className="ship-stack stack-a" />
          <span className="ship-stack stack-b" />
          <span className="ship-bridge" />
          <span className="ship-deck upper-deck" />
          <span className="ship-deck main-deck" />
          <span className="boat-hull">
            <span className="hull-stripe" />
          </span>
          <span className="ship-bow-light" />
        </div>

        <div className="case-overlay" aria-label="Visible case markers">
          {markers.confirmed.map((marker) => (
            <span
              className="case-marker confirmed"
              key={marker.id}
              style={{
                "--x": marker.x,
                "--y": marker.y,
                "--x1": marker.drift[0],
                "--y1": marker.drift[1],
                "--x2": marker.drift[2],
                "--y2": marker.drift[3],
                "--delay": marker.delay
              }}
              title={marker.label}
            >
              <span className="virus-dot" />
              {marker.flag && <span className="case-flag">{marker.flag}</span>}
            </span>
          ))}

          {markers.suspected.map((marker) => (
            <span
              className="case-marker suspected"
              key={marker.id}
              style={{
                "--x": marker.x,
                "--y": marker.y,
                "--x1": marker.drift[0],
                "--y1": marker.drift[1],
                "--x2": marker.drift[2],
                "--y2": marker.drift[3],
                "--delay": marker.delay
              }}
              title={marker.label}
            >
              <span className="virus-dot" />
              {marker.flag && <span className="case-flag">{marker.flag}</span>}
            </span>
          ))}

          {markers.deaths.map((marker) => (
            <span
              className="death-marker"
              key={marker.id}
              style={{ "--x": marker.x, "--y": marker.y }}
              title={marker.label}
            >
              <span className="tombstone">RIP</span>
              {marker.flag && <span className="case-flag">{marker.flag}</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="event-foot event-foot-right">
        <span>UPDATED {event.updated}</span>
      </div>
    </section>
  );
}
