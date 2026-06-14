import { useEffect, useState } from "react";
import type { GameState } from "../game/gameState";

type QuarterTransitionProps = {
  state: GameState;
  onComplete: () => void;
};

function getWindingPos(t: number) {
  const index = Math.max(0, Math.min(15, t - 1));
  const row = Math.floor(index / 4);
  const isRowOdd = row % 2 === 1;
  const col = isRowOdd ? 3 - (index % 4) : index % 4;
  return { row, col };
}

export function QuarterTransition({ state, onComplete }: QuarterTransitionProps) {
  const newTurn = Math.min(state.company.turn, state.maxTurns);
  const oldTurn = Math.max(1, newTurn - 1);

  const startX = 90;
  const colSpacing = 72;
  const startY = 40;
  const rowSpacing = 76;

  // Calculate coordinates for all 16 turns
  const points = Array.from({ length: 16 }).map((_, i) => {
    const t = i + 1;
    const { row, col } = getWindingPos(t);
    return {
      x: startX + col * colSpacing,
      y: startY + row * rowSpacing,
      turn: t,
      quarter: ((t - 1) % 4) + 1,
      year: 2026 + Math.floor((t - 1) / 4),
    };
  });

  // Calculate accumulated lengths for line drawing
  const pathLengths = [0];
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    acc += Math.sqrt(dx * dx + dy * dy);
    pathLengths.push(acc);
  }
  const totalLength = acc;

  // Animation states
  const [markerIdx, setMarkerIdx] = useState(oldTurn - 1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Start animation shortly after mount
    const timer = setTimeout(() => {
      setMarkerIdx(newTurn - 1);
    }, 200);

    // Call onComplete when the animation completes and holds
    const completeTimer = setTimeout(() => {
      setIsFinished(true);
    }, 1800);

    const dismissTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
      clearTimeout(dismissTimer);
    };
  }, [newTurn, onComplete]);

  // SVG path definitions
  const basePathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  
  // Calculate completed path length for stroke-dashoffset
  const currentLength = pathLengths[markerIdx];
  const strokeDashoffset = totalLength - currentLength;

  const oldQ = ((oldTurn - 1) % 4) + 1;
  const oldYear = 2026 + Math.floor((oldTurn - 1) / 4);
  const newQ = ((newTurn - 1) % 4) + 1;
  const newYear = 2026 + Math.floor((newTurn - 1) / 4);

  const years = [2026, 2027, 2028, 2029];

  return (
    <div className={`quarter-transition-overlay ${isFinished ? "is-leaving" : ""}`} role="presentation">
      <div className="transition-card">
        <p className="transition-title">Смена квартала</p>
        
        <div className="transition-quarter-badge">
          <span className="badge-old">Q{oldQ} {oldYear}</span>
          <span className="badge-arrow">➔</span>
          <span className={`badge-new ${markerIdx === newTurn - 1 ? "animate-pop" : ""}`}>Q{newQ} {newYear}</span>
        </div>

        <div className="roadmap-container">
          {/* Year labels on the left */}
          {years.map((year, index) => (
            <div
              key={year}
              className="roadmap-year-label"
              style={{
                position: "absolute",
                left: "12px",
                top: `${startY + index * rowSpacing}px`,
                transform: "translateY(-50%)",
              }}
            >
              {year}
            </div>
          ))}

          {/* SVG Connecting Paths */}
          <svg className="roadmap-svg" viewBox="0 0 350 320">
            <path
              d={basePathD}
              fill="none"
              stroke="var(--line)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
            <path
              d={basePathD}
              fill="none"
              stroke="var(--green)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={totalLength}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
          </svg>

          {/* Quarter Node Circles */}
          {points.map((p, idx) => {
            const isCompleted = idx < newTurn - 1;
            const isActive = idx === newTurn - 1;
            let nodeClass = "roadmap-cell";
            if (isCompleted) nodeClass += " is-completed";
            if (isActive && markerIdx === newTurn - 1) nodeClass += " is-active";

            return (
              <div
                key={p.turn}
                className={nodeClass}
                style={{
                  position: "absolute",
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                Q{p.quarter}
              </div>
            );
          })}

          {/* Sliding Marker */}
          <div
            className="roadmap-marker"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(${points[markerIdx].x}px, ${points[markerIdx].y}px) translate(-50%, -50%)`,
              transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <div className="roadmap-marker-core" />
          </div>
        </div>

        <button className="button ghost small skip-btn" type="button" onClick={onComplete}>
          Пропустить анимацию
        </button>
      </div>
    </div>
  );
}
