"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewCounter() {
  const hasCounted = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (hasCounted.current) {
      return;
    }

    if (window.matchMedia("(max-width: 760px) and (pointer: coarse)").matches) {
      return;
    }

    hasCounted.current = true;
    const controller = new AbortController();

    fetch("/api/view-counter", {
      method: "POST",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Counter unavailable"))))
      .then((data) => {
        if (Number.isFinite(data.count)) {
          setCount(data.count);
        }
      })
      .catch(() => {
        setCount(0);
      });

    return () => controller.abort();
  }, []);

  const digits = String(count).padStart(7, "0").split("");

  return (
    <aside className="view-counter" aria-label={`Visitor counter ${count}`}>
      <span className="view-counter-label">VISITORS</span>
      <span className="view-counter-window">
        {digits.map((digit, index) => (
          <span className="view-counter-digit" key={`${digit}-${index}`}>
            {digit}
          </span>
        ))}
      </span>
    </aside>
  );
}
