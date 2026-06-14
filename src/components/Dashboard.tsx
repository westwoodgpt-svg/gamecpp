import type { CSSProperties } from "react";
import { calculateInnovationScore } from "../game/gameState";
import { formatMoney } from "../game/gameLogic";
import type { GameState } from "../game/gameState";

type DashboardProps = {
  state: GameState;
};

const metrics = [
  { key: "year", label: "Год", className: "metric--year" },
  { key: "cash", label: "Деньги", className: "metric--cash" },
  { key: "grants", label: "Поддержка", className: "metric--grants" },
  { key: "active", label: "Активные меры", className: "metric--active" },
  { key: "own", label: "Свои средства", className: "metric--own" },
  { key: "reputation", label: "Репутация", className: "metric--reputation" },
] as const;

function getMetricIcon(key: string) {
  switch (key) {
    case "year":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "cash":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "grants":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v7H8V6a4 4 0 0 1 4-4z" />
        </svg>
      );
    case "active":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
        </svg>
      );
    case "own":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M9 10h1M9 14h1M14 10h1M14 14h1" />
        </svg>
      );
    case "reputation":
      return (
        <svg className="metric-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return null;
  }
}

export function Dashboard({ state }: DashboardProps) {
  const score = calculateInnovationScore(state);
  const completed = state.projects.filter((project) => project.isSuccessful).length;
  const turn = Math.min(state.company.turn, state.maxTurns);
  const cashLow = state.company.cash < 4_000_000;

  const values: Record<(typeof metrics)[number]["key"], { value: string; hint: string }> = {
    year: { value: String(state.company.year), hint: `ход ${turn} из ${state.maxTurns}` },
    cash: { value: formatMoney(state.company.cash), hint: cashLow ? "остаток низкий" : "остаток" },
    grants: { value: formatMoney(state.company.grantsReceived), hint: "гранты и субсидии" },
    active: { value: String(state.activeSupports.length), hint: "одобренных заявок" },
    own: { value: formatMoney(state.company.ownFundsSpent), hint: "вложено компанией" },
    reputation: { value: `${state.company.reputation}/100`, hint: `${completed} проектов на рынке` },
  };

  return (
    <section className="dashboard" aria-label="Показатели компании">
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={`metric ${metric.className}${metric.key === "cash" && cashLow ? " metric--alert" : ""}`}
        >
          <div className="metric-header">
            <span>{metric.label}</span>
            {getMetricIcon(metric.key)}
          </div>
          <strong>{values[metric.key].value}</strong>
          <small>{values[metric.key].hint}</small>
        </div>
      ))}
      <div className="score-panel">
        <div className="score-ring" style={{ "--score": score } as CSSProperties}>
          <span className="score-ring__value">{score}</span>
        </div>
        <div className="score-copy">
          <span>Индекс инновационности</span>
          <strong>{score}</strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${score}%` }} />
          </div>
          <small>{score >= 70 ? "сильная позиция" : score >= 40 ? "есть потенциал роста" : "нужен прорыв"}</small>
        </div>
      </div>
    </section>
  );
}
