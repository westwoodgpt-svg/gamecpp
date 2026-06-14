import type { CSSProperties } from "react";
import { sectorLabels, stageLabels, stageOrder } from "../game/gameData";
import { calculateSuccessChance, formatMoney } from "../game/gameLogic";
import type { GameState, Project, ProjectStage } from "../game/gameState";

type ProjectsPanelProps = {
  state: GameState;
  onInvest: (projectId: string, amount: number) => void;
  onToggleActive: (projectId: string) => void;
};

function turnToQuarter(turn: number): string {
  const q = ((turn - 1) % 4) + 1;
  const y = 2026 + Math.floor((turn - 1) / 4);
  return `${y} г., кв. ${q}`;
}

export function ProjectsPanel({ state, onInvest, onToggleActive }: ProjectsPanelProps) {
  const activeCount = state.projects.filter((p) => p.unlockedAtTurn <= state.company.turn).length;

  return (
    <section className="panel projects-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Портфель</p>
          <h2>Проекты компании</h2>
        </div>
        <span className="panel-count">{activeCount} из {state.projects.length} направлений</span>
      </div>
      <div className="projects-grid">
        {state.projects.map((project, index) => {
          const isLocked = project.unlockedAtTurn > state.company.turn;
          return isLocked ? (
            <LockedProjectCard
              key={project.id}
              project={project}
              availableAt={turnToQuarter(project.unlockedAtTurn)}
              style={{ animationDelay: `${index * 60}ms` }}
            />
          ) : (
            <ProjectCard
              key={project.id}
              project={project}
              reputation={state.company.reputation}
              grantCount={state.activeSupports.filter((item) => item.projectId === project.id).length}
              canInvest={state.company.cash > 0 && !state.isGameOver}
              onInvest={onInvest}
              onToggleActive={onToggleActive}
              style={{ animationDelay: `${index * 60}ms` }}
            />
          );
        })}
      </div>
    </section>
  );
}

type LockedProjectCardProps = {
  project: Project;
  availableAt: string;
  style?: CSSProperties;
};

function LockedProjectCard({ project, availableAt, style }: LockedProjectCardProps) {
  return (
    <article className="project-card project-card--locked" style={style} aria-label={`Заблокированное направление: ${project.name}`}>
      <div className="project-card__accent" aria-hidden="true" />
      <div className="locked-overlay">
        <div className="locked-icon" aria-hidden="true">🔒</div>
        <div className="locked-info">
          <span className="sector-tag">{sectorLabels[project.sector]}</span>
          <h3 className="locked-title">{project.name}</h3>
          <p className="locked-hint">Направление откроется в <strong>{availableAt}</strong>, когда компания наберёт достаточный опыт</p>
        </div>
      </div>
    </article>
  );
}

type ProjectCardProps = {
  project: Project;
  reputation: number;
  grantCount: number;
  canInvest: boolean;
  onInvest: (projectId: string, amount: number) => void;
  onToggleActive: (projectId: string) => void;
  style?: CSSProperties;
};

function TRLSegments({ trl }: { trl: number }) {
  return (
    <div className="trl-segments" aria-label={`Уровень технологической готовности ${trl} из 9`}>
      <div className="trl-segments-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={`trl-segment-bar${i < trl ? " is-active" : ""}`}
            title={`Уровень технологической готовности ${i + 1}`}
          />
        ))}
      </div>
      <span className="trl-number-val">{trl}/9</span>
    </div>
  );
}

function StagePipeline({ stage }: { stage: ProjectStage }) {
  const currentIndex = stageOrder.indexOf(stage);
  const fillWidth = `${(currentIndex / (stageOrder.length - 1)) * 100}%`;

  return (
    <div className="stage-pipeline-container">
      <div className="stage-pipeline" aria-label={`Стадия: ${stageLabels[stage]}`}>
        <div className="stage-pipeline__track-fill" style={{ width: fillWidth }} />
        {stageOrder.map((step, index) => (
          <span
            key={step}
            className={`stage-pipeline__dot${index <= currentIndex ? " is-done" : ""}${index === currentIndex ? " is-current" : ""}`}
          >
            <span className="stage-pipeline__dot-tooltip">{stageLabels[step]}</span>
          </span>
        ))}
      </div>
      <div className="stage-pipeline-label-row">
        <span>Стадия:</span>
        <strong className="stage-pipeline__label-text">{stageLabels[stage]}</strong>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  reputation,
  grantCount,
  canInvest,
  onInvest,
  onToggleActive,
  style,
}: ProjectCardProps) {
  const progress = Math.min(100, Math.round((project.spent / project.budgetNeeded) * 100));
  const successChance = calculateSuccessChance(project, reputation);
  const status = project.isSuccessful ? "на-рынке" : project.isActive ? "активен" : "пауза";
  const statusLabel = project.isSuccessful ? "на рынке" : project.isActive ? "активен" : "пауза";
  const statusIcon = project.isSuccessful ? "🚀" : project.isActive ? "⚡" : "⏸️";

  return (
    <article
      className={`project-card sector-${project.sector}${project.isActive ? "" : " muted"}${project.isSuccessful ? " is-commercial" : ""}`}
      style={style}
    >
      <div className="project-card__accent" aria-hidden="true" />
      <div className="project-title-row">
        <div className="project-title-block">
          <span className="sector-tag">{sectorLabels[project.sector]}</span>
          <h3>{project.name}</h3>
        </div>
        <div className="project-badges">
          {grantCount > 0 ? (
            <span className="badge badge-grant">грант{grantCount > 1 ? ` ×${grantCount}` : ""}</span>
          ) : null}
          <span className={`status status-${status}`}>
            <span style={{ marginRight: "3px" }}>{statusIcon}</span>
            {statusLabel}
          </span>
        </div>
      </div>

      <StagePipeline stage={project.stage} />

      <dl className="project-meta">
        <div className="trl-meta-item">
          <dt>Уровень технологической готовности</dt>
          <dd>
            <TRLSegments trl={project.trl} />
          </dd>
        </div>
        <div>
          <dt>Шанс прогресса</dt>
          <dd className={successChance >= 60 ? "chance-high" : successChance >= 35 ? "chance-mid" : "chance-low"}>
            {successChance}%
          </dd>
        </div>
        <div>
          <dt>Потрачено</dt>
          <dd>{formatMoney(project.spent)}</dd>
        </div>
        <div>
          <dt>Бюджет</dt>
          <dd>{formatMoney(project.budgetNeeded)}</dd>
        </div>
      </dl>

      <div className="budget-row">
        <span>Освоение бюджета</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-track slim">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="project-actions">
        <button
          className="button small primary"
          type="button"
          onClick={() => onInvest(project.id, 1_000_000)}
          disabled={!canInvest || project.isSuccessful !== null}
        >
          +1 млн
        </button>
        <button
          className="button small ghost"
          type="button"
          onClick={() => onToggleActive(project.id)}
          disabled={project.isSuccessful !== null}
        >
          {project.isActive ? "Пауза" : "Возобновить"}
        </button>
      </div>
    </article>
  );
}
