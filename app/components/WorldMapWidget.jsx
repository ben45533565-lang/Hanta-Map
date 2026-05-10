"use client";

import { MapPinned, Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const statusLabels = {
  confirmed: "Confirmed",
  suspected: "Suspected",
  contact: "Returned / tracing"
};

const legendItems = [
  { status: "confirmed", label: "Confirmed signals" },
  { status: "suspected", label: "Suspect signals" },
  { status: "contact", label: "Tracing signals" }
];

const MIN_SCALE = 1;
const MAX_SCALE = 3.2;
const DEFAULT_VIEW = { scale: 1, x: 0, y: 0 };

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pointerDistance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function pointerMidpoint(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2
  };
}

function localPoint(stage, clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function clampView(view, stage) {
  const scale = clampNumber(view.scale, MIN_SCALE, MAX_SCALE);

  if (!stage || scale <= MIN_SCALE) {
    return { scale: MIN_SCALE, x: 0, y: 0 };
  }

  const rect = stage.getBoundingClientRect();
  return {
    scale,
    x: clampNumber(view.x, rect.width * (1 - scale), 0),
    y: clampNumber(view.y, rect.height * (1 - scale), 0)
  };
}

export default function WorldMapWidget({ signals, totals = {}, updated }) {
  const stageRef = useRef(null);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);
  const viewRef = useRef(DEFAULT_VIEW);
  const [view, setViewState] = useState(DEFAULT_VIEW);
  const [isDragging, setIsDragging] = useState(false);

  const setView = useCallback((nextView) => {
    setViewState((current) => {
      const next = typeof nextView === "function" ? nextView(current) : nextView;
      viewRef.current = next;
      return next;
    });
  }, []);

  const zoomAt = useCallback(
    (targetScale, focus) => {
      const stage = stageRef.current;
      if (!stage) {
        return;
      }

      setView((current) => {
        const scale = clampNumber(targetScale, MIN_SCALE, MAX_SCALE);
        const point = focus || {
          x: stage.clientWidth / 2,
          y: stage.clientHeight / 2
        };
        const contentX = (point.x - current.x) / current.scale;
        const contentY = (point.y - current.y) / current.scale;

        return clampView(
          {
            scale,
            x: point.x - contentX * scale,
            y: point.y - contentY * scale
          },
          stage
        );
      });
    },
    [setView]
  );

  const panBy = useCallback(
    (dx, dy) => {
      const stage = stageRef.current;
      setView((current) => clampView({ ...current, x: current.x + dx, y: current.y + dy }, stage));
    },
    [setView]
  );

  const resetView = useCallback(() => {
    setView(DEFAULT_VIEW);
    pointersRef.current.clear();
    gestureRef.current = null;
    setIsDragging(false);
  }, [setView]);

  const beginGesture = useCallback(() => {
    const stage = stageRef.current;
    const pointers = [...pointersRef.current.values()];

    if (!stage || pointers.length === 0) {
      gestureRef.current = null;
      setIsDragging(false);
      return;
    }

    if (pointers.length >= 2) {
      const first = localPoint(stage, pointers[0].x, pointers[0].y);
      const second = localPoint(stage, pointers[1].x, pointers[1].y);
      const mid = pointerMidpoint(first, second);
      const current = viewRef.current;

      gestureRef.current = {
        type: "pinch",
        startDistance: pointerDistance(first, second),
        startMid: mid,
        startView: current,
        contentX: (mid.x - current.x) / current.scale,
        contentY: (mid.y - current.y) / current.scale
      };
      setIsDragging(true);
      return;
    }

    const point = localPoint(stage, pointers[0].x, pointers[0].y);
    gestureRef.current = {
      type: "pan",
      startPoint: point,
      startView: viewRef.current
    };
    setIsDragging(true);
  }, []);

  const handlePointerDown = useCallback(
    (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      beginGesture();
    },
    [beginGesture]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!pointersRef.current.has(event.pointerId)) {
        return;
      }

      const stage = stageRef.current;
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const gesture = gestureRef.current;

      if (!stage || !gesture) {
        return;
      }

      const pointers = [...pointersRef.current.values()];

      if (gesture.type === "pinch" && pointers.length >= 2) {
        const first = localPoint(stage, pointers[0].x, pointers[0].y);
        const second = localPoint(stage, pointers[1].x, pointers[1].y);
        const mid = pointerMidpoint(first, second);
        const nextScale = gesture.startView.scale * (pointerDistance(first, second) / gesture.startDistance);

        setView(
          clampView(
            {
              scale: nextScale,
              x: mid.x - gesture.contentX * nextScale,
              y: mid.y - gesture.contentY * nextScale
            },
            stage
          )
        );
        return;
      }

      if (gesture.type === "pan" && pointers.length === 1) {
        const point = localPoint(stage, event.clientX, event.clientY);
        setView(
          clampView(
            {
              ...gesture.startView,
              x: gesture.startView.x + point.x - gesture.startPoint.x,
              y: gesture.startView.y + point.y - gesture.startPoint.y
            },
            stage
          )
        );
      }
    },
    [setView]
  );

  const handlePointerEnd = useCallback(
    (event) => {
      pointersRef.current.delete(event.pointerId);
      beginGesture();
    },
    [beginGesture]
  );

  const handleWheel = useCallback(
    (event) => {
      const stage = stageRef.current;
      if (!stage) {
        return;
      }

      event.preventDefault();
      const focus = localPoint(stage, event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? 1.16 : 0.86;
      zoomAt(viewRef.current.scale * factor, focus);
    },
    [zoomAt]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      const keyActions = {
        "+": () => zoomAt(viewRef.current.scale * 1.18),
        "=": () => zoomAt(viewRef.current.scale * 1.18),
        "-": () => zoomAt(viewRef.current.scale * 0.84),
        ArrowLeft: () => panBy(54, 0),
        ArrowRight: () => panBy(-54, 0),
        ArrowUp: () => panBy(0, 54),
        ArrowDown: () => panBy(0, -54),
        Escape: resetView,
        "0": resetView
      };

      const action = keyActions[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    },
    [panBy, resetView, zoomAt]
  );

  const legendTotals = legendItems.map((item) => ({
    ...item,
    total: totals[item.status] ?? signals.filter((signal) => signal.status === item.status).length
  }));

  const transformStyle = {
    transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`
  };

  return (
    <section className="panel world-map-panel">
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon cyan-icon">
            <MapPinned size={18} />
          </span>
          <div>
            <h2>World Signal Map</h2>
            <p>Country-level case and traveler tracing status</p>
          </div>
        </div>
        <span className="badge cyan">UPDATED {updated}</span>
      </div>

      <div className="world-map-body">
        <div
          className={`world-map-stage ${isDragging ? "is-dragging" : ""}`}
          ref={stageRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onWheel={handleWheel}
          aria-label="World map of confirmed, suspected, and contact tracing signals"
        >
          <img className="map-construction" src="/construction.gif" alt="Under construction" />

          <div className="world-map-legend in-map">
            {legendTotals.map((item) => (
              <div className={`legend-pill ${item.status}`} key={item.status}>
                <span />
                <strong>{item.total}</strong>
                <em>{item.label}</em>
              </div>
            ))}
          </div>

          <div className="map-controls" aria-label="Map controls">
            <button
              type="button"
              onClick={() => zoomAt(viewRef.current.scale * 1.2)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              onClick={() => zoomAt(viewRef.current.scale * 0.84)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={resetView}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Reset map"
              title="Reset map"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="world-map-transform-layer" style={transformStyle}>
            <img className="world-map-image" src="/world-map.svg" alt="" aria-hidden="true" draggable={false} />
            <svg className="world-map-route-layer" viewBox="60 38 940 370" aria-hidden="true">
              <path className="map-route" d="M308 330C365 278 402 241 430 212C446 195 452 181 454 171" />
            </svg>

            <span className="world-map-vessel" aria-label="MV Hondius vessel location">
              <span className="world-ship-name">MV HONDIUS</span>
              <span className="world-ship-mast" />
              <span className="world-ship-deck world-ship-deck-top" />
              <span className="world-ship-deck world-ship-deck-mid" />
              <span className="world-ship-hull" />
            </span>

            {signals.map((signal, index) => (
              <span
                className={`map-signal ${signal.status}`}
                key={signal.country}
                tabIndex={0}
                style={{
                  "--x": signal.x,
                  "--y": signal.y,
                  "--label-x": signal.labelX,
                  "--label-y": signal.labelY,
                  "--tooltip-x": signal.tooltipX,
                  "--tooltip-y": signal.tooltipY,
                  "--delay": `${index * 0.12}s`
                }}
                aria-label={`${signal.country}: ${statusLabels[signal.status]} / ${signal.count}. ${signal.detail}. Source: ${signal.source}`}
              >
                <span className="map-dot" />
                <code>{signal.code}</code>
                <span className="map-tooltip" role="tooltip">
                  <strong>{signal.country}</strong>
                  <em>{statusLabels[signal.status]} / {signal.count}</em>
                  <small>{signal.detail}</small>
                  <b>{signal.source}</b>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
