import { useMemo, useState } from "react";
import { sectorLabels, stageLabels } from "../game/gameData";
import { supportTooltips, uiTexts } from "../game/gameTexts";
import { formatMoney, isSupportApplied, canApplySupport } from "../game/gameLogic";
import type { GameState, Project, SupportMeasure } from "../game/gameState";

type SupportPanelProps = {
  state: GameState;
  onApply: (projectId: string, supportId: string) => void;
};

export function SupportPanel({ state, onApply }: SupportPanelProps) {
  const availableProjects = state.projects.filter((p) => p.unlockedAtTurn <= state.company.turn);
  const [selectedSupportId, setSelectedSupportId] = useState(state.supports[0]?.id ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState(availableProjects[0]?.id ?? "");

  const selectedSupport = useMemo(
    () => state.supports.find((support) => support.id === selectedSupportId) ?? state.supports[0],
    [selectedSupportId, state.supports],
  );

  // Group support measures
  const federalSupports = useMemo(
    () => state.supports.filter((s) => s.type.startsWith("fasie")),
    [state.supports],
  );
  const regionalSupports = useMemo(
    () => state.supports.filter((s) => !s.type.startsWith("fasie")),
    [state.supports],
  );

  const renderSupportItem = (support: SupportMeasure) => {
    const project = state.projects.find((p) => p.id === selectedProjectId);
    const eligibility = project ? canApplySupport(state, project, support) : { ok: false, reason: "" };
    const isApplied = project ? isSupportApplied(state, project.id, support.id) : false;

    let badgeClass = "ineligible";
    let badgeText = "Не подходит";

    if (isApplied) {
      badgeClass = "applied";
      badgeText = "Подано";
    } else if (eligibility.ok) {
      badgeClass = "eligible";
      badgeText = "Подходит";
    }

    return (
      <button
        key={support.id}
        type="button"
        className={`support-item support-item--${support.type} ${selectedSupport?.id === support.id ? "selected" : ""} ${!eligibility.ok && !isApplied ? "is-ineligible" : ""}`}
        onClick={() => setSelectedSupportId(support.id)}
        title={supportTooltips[support.type]}
      >
        <div className="support-item-header">
          <span className="support-item__title">{support.name}</span>
          <span className={`eligibility-badge eligibility-badge--${badgeClass}`}>
            {badgeText}
          </span>
        </div>
        <div className="support-item-footer">
          <small>{support.maxAmount > 0 ? `до ${formatMoney(support.maxAmount)}` : "без выплаты"}</small>
          {!eligibility.ok && !isApplied && (
            <span className="ineligibility-reason" title={eligibility.reason}>
              {eligibility.reason}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <section className="panel support-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Инструменты</p>
          <h2>Меры поддержки</h2>
        </div>
      </div>

      {state.activeSupports.length > 0 ? (
        <ul className="active-supports-list" aria-label="Активные меры поддержки">
          {state.activeSupports.map((item) => {
            const project = state.projects.find((entry) => entry.id === item.projectId);
            const support = state.supports.find((entry) => entry.id === item.supportId);
            if (!project || !support) {
              return null;
            }

            return (
              <li key={`${item.projectId}-${item.supportId}`}>
                <strong>{support.name}</strong>
                <span>
                  {project.name} · {formatMoney(item.amountApproved)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="support-layout">
        <div className="support-list-grouped">
          <div className="support-group">
            <h4 className="support-group-title">Федеральные гранты (ФСИ)</h4>
            <div className="support-list" role="list">
              {federalSupports.map(renderSupportItem)}
            </div>
          </div>
          <div className="support-group">
            <h4 className="support-group-title">Региональные меры (ЦПП КО)</h4>
            <div className="support-list" role="list">
              {regionalSupports.map(renderSupportItem)}
            </div>
          </div>
        </div>

        {selectedSupport ? (
          <SupportDetails
            support={selectedSupport}
            selectedProjectId={selectedProjectId}
            state={state}
            availableProjects={availableProjects}
            onProjectChange={setSelectedProjectId}
            onApply={onApply}
          />
        ) : null}
      </div>
    </section>
  );
}

type SupportDetailsProps = {
  support: SupportMeasure;
  selectedProjectId: string;
  state: GameState;
  availableProjects: Project[];
  onProjectChange: (projectId: string) => void;
  onApply: (projectId: string, supportId: string) => void;
};

function SupportDetails({ support, selectedProjectId, state, availableProjects, onProjectChange, onApply }: SupportDetailsProps) {
  const sectors =
    support.applicableSectors === "any"
      ? "любые"
      : support.applicableSectors.map((sector) => sectorLabels[sector]).join(", ");
  const selectedPairApplied = isSupportApplied(state, selectedProjectId, support.id);
  const allProjectsApplied = availableProjects.every((project) => isSupportApplied(state, project.id, support.id));

  return (
    <div className={`support-details support-details--${support.type}`}>
      <h3>{support.name}</h3>
      <p>{support.description}</p>
      <dl className="support-meta">
        <div>
          <dt>Покрытие</dt>
          <dd>{support.coveragePercent}%</dd>
        </div>
        <div>
          <dt>Лимит</dt>
          <dd>{support.maxAmount > 0 ? formatMoney(support.maxAmount) : "не выплачивается"}</dd>
        </div>
        <div>
          <dt>Софинансирование</dt>
          <dd>{support.requiresCofinancing ? "нужно" : "не требуется"}</dd>
        </div>
        <div>
          <dt>Стадии</dt>
          <dd>{support.applicableStages.map((stage) => stageLabels[stage]).join(", ")}</dd>
        </div>
        <div>
          <dt>Отрасли</dt>
          <dd>{sectors}</dd>
        </div>
      </dl>
      <label className="field">
        <span>{uiTexts.selectProject}</span>
        <select value={selectedProjectId} onChange={(event) => onProjectChange(event.target.value)}>
          {availableProjects.map((project) => {
            const applied = isSupportApplied(state, project.id, support.id);

            return (
              <option key={project.id} value={project.id} disabled={applied}>
                {project.name}
                {applied ? " — заявка подана" : ""}
              </option>
            );
          })}
        </select>
      </label>
      {selectedPairApplied ? (
        <p className="support-note">Эта мера уже применена к выбранному проекту в текущем квартале.</p>
      ) : null}
      {allProjectsApplied ? (
        <p className="support-note">По всем проектам эта мера уже использована в текущем квартале.</p>
      ) : null}
      <button
        className="button primary full"
        type="button"
        onClick={() => onApply(selectedProjectId, support.id)}
        disabled={state.isGameOver || selectedPairApplied || allProjectsApplied}
      >
        {selectedPairApplied ? "Заявка уже подана" : uiTexts.apply}
      </button>
    </div>
  );
}
