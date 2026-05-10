"use client";

import { useEffect, useRef } from "react";

export default function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const glyphs = "HANTA0123456789WHOCDCNNDSSPCRRNA";
    let columns = 0;
    let drops = [];
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / 18);
      drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
    };

    const draw = () => {
      context.fillStyle = "rgba(10, 10, 10, 0.18)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(0, 255, 65, 0.22)";
      context.font = "14px 'Share Tech Mono', monospace";

      drops.forEach((drop, index) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = index * 18;
        context.fillText(char, x, drop);
        drops[index] = drop > canvas.height + Math.random() * 1000 ? 0 : drop + 18;
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}
