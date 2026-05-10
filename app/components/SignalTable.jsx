"use client";

import { Activity, Search } from "lucide-react";
import { useMemo, useState } from "react";

const filters = ["ALL", "GLOBAL", "US", "CLINICAL", "PREVENTION"];

export default function SignalTable({ rows }) {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const filterMatch = filter === "ALL" || row.scope === filter;
      const queryMatch =
        !normalized ||
        [row.signal, row.scope, row.source, row.action]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return filterMatch && queryMatch;
    });
  }, [filter, query, rows]);

  return (
    <section className="panel signal-panel">
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">
            <Activity size={18} />
          </span>
          <div>
            <h2>Signal Board</h2>
            <p>Case, clinical, and prevention watch rows</p>
          </div>
        </div>
        <span className="badge cyan">{filteredRows.length} VECTORS</span>
      </div>

      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label="Signal filters">
          {filters.map((item) => (
            <button
              className={filter === item ? "active" : ""}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SEARCH SIGNALS"
          />
        </label>
      </div>

      <div className="signal-table">
        <div className="signal-row signal-head">
          <span>Scope</span>
          <span>Signal</span>
          <span>Level</span>
          <span>Count</span>
          <span>Source</span>
          <span>Action</span>
        </div>
        {filteredRows.map((row) => (
          <div className="signal-row" key={row.id}>
            <span className="scope">{row.scope}</span>
            <span>
              <strong>{row.signal}</strong>
              <small>{row.update}</small>
            </span>
            <span>
              <span className={`severity ${row.level}`}>{row.level}</span>
            </span>
            <span className="count">{row.count}</span>
            <span>{row.source}</span>
            <span>{row.action}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
