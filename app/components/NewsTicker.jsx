"use client";

import { useEffect, useState } from "react";

export default function NewsTicker({ items }) {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const updateTimestamp = () => {
      setTimestamp(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short"
        }).format(new Date())
      );
    };

    updateTimestamp();
    const timer = window.setInterval(updateTimestamp, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stampedItems = items.map((item) => `[${timestamp || "--:--:--"}] ${item}`);

  return (
    <div className="ticker-bar">
      <div className="ticker-label">NEWS WIRE</div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {[...stampedItems, ...stampedItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
