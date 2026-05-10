"use client";

import { useEffect, useState } from "react";

export default function LastUpdated() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const zone =
      new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value || "";
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} ${zone}`;

    setTime(stamp.trim());
  }, []);

  return (
    <span className="last-updated">
      <span>Last updated</span>
      <time>{time || "--/--/----, --:--:--"}</time>
    </span>
  );
}
