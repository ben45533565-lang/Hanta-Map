"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";

function monthLabel(date = "") {
  if (date.startsWith("APR")) {
    return "April";
  }

  if (date.startsWith("MAY")) {
    return "May";
  }

  return "Timeline";
}

function groupByMonth(items) {
  return items.reduce((groups, item) => {
    const month = monthLabel(item.date);
    const existing = groups.find((group) => group.month === month);

    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ month, items: [item] });
    }

    return groups;
  }, []);
}

export default function TimelineCards({ items }) {
  const [selected, setSelected] = useState(null);
  const currentItem = items[items.length - 1];
  const historyItems = items.slice(0, -1).toReversed();
  const monthGroups = groupByMonth(historyItems);

  useEffect(() => {
    if (!selected) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <>
      <div className="top-timeline">
        {currentItem && (
          <button
            className={`top-timeline-current ${currentItem.level}`}
            onClick={() => setSelected(currentItem)}
            type="button"
          >
            <span className="timeline-current-kicker">Current update</span>
            <time>{currentItem.date}</time>
            <div>
              <h3>{currentItem.title}</h3>
              <p>{currentItem.detail}</p>
            </div>
          </button>
        )}

        {monthGroups.map((group) => (
          <section className="timeline-month" key={group.month} aria-label={`${group.month} outbreak events`}>
            <div className="timeline-month-label">{group.month}</div>
            <div className="timeline-month-items">
              {group.items.map((item) => (
                <button
                  className={`top-timeline-item ${item.level}`}
                  key={`${item.date}-${item.title}`}
                  onClick={() => setSelected(item)}
                  type="button"
                >
                  <time>{item.date}</time>
                  <span className="timeline-node" />
                  <span className="timeline-item-copy">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <div className="timeline-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            aria-labelledby="timeline-modal-title"
            aria-modal="true"
            className="timeline-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="timeline-modal-header">
              <div>
                <time>{selected.date}</time>
                <h3 id="timeline-modal-title">{selected.title}</h3>
              </div>
              <button aria-label="Close timeline detail" className="timeline-modal-close" onClick={() => setSelected(null)} type="button">
                <X size={18} />
              </button>
            </div>
            <div className="timeline-modal-body">
              <span className={`timeline-modal-level ${selected.level}`}>{selected.level}</span>
              <p>{selected.detail}</p>
            </div>
            <div className="timeline-modal-footer">
              <span>{selected.source}</span>
              <a href={selected.url} rel="noreferrer" target="_blank">
                Source <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
