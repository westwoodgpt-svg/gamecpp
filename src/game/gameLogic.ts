import { initialCharacters, stageOrder } from "./gameData";
import type {
  ActiveSupport,
  CharacterState,
  GameEvent,
  GameState,
  Project,
  ProjectStage,
  SupportMeasure,
  SupportType,
} from "./gameState";

const BASE_QUARTER_COST = 650_000;
const LOW_CASH_THRESHOLD = 4_000_000;

export function isSupportApplied(state: GameState, projectId: string, supportId: string): boolean {
  return state.activeSupports.some((item) => item.projectId === projectId && item.supportId === supportId);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value) + " ₽";
}

export function getNextStage(stage: ProjectStage): ProjectStage {
  const index = stageOrder.indexOf(stage);
  return stageOrder[Math.min(index + 1, stageOrder.length - 1)];
}

export function calculateSuccessChance(project: Project, reputation: number): number {
  const stageBonus = stageOrder.indexOf(project.stage) * 8;
  const trlBonus = project.trl * 5;
  const reputationBonus = Math.round((reputation - 50) / 2);
  return Math.max(15, Math.min(92, 20 + stageBonus + trlBonus + project.successChanceModifier + reputationBonus));
}

export function calculateInnovationScore(state: GameState): number {
  const successfulProjects = state.projects.filter((project) => project.isSuccessful).length;
  const commercialProjects = state.projects.filter((project) => project.stage === "commercial").length;
  const totalSpent = state.company.ownFundsSpent + state.company.grantsReceived;
  const ownFundsShare = totalSpent > 0 ? state.company.ownFundsSpent / totalSpent : 1;
  const grantScore = Math.min(25, state.company.grantsReceived / 1_000_000);
  const projectScore = successfulProjects * 18 + commercialProjects * 10;
  const reputationScore = state.company.reputation * 0.25;
  const sustainabilityScore = Math.max(0, 20 - ownFundsShare * 20);
  return Math.round(Math.min(100, projectScore + grantScore + reputationScore + sustainabilityScore));
}

export function canApplySupport(
  state: GameState,
  project: Project,
  support: SupportMeasure,
): { ok: true } | { ok: false; reason: string } {
  if (project.unlockedAtTurn > state.company.turn) {
    return { ok: false, reason: "Это направление ещё не открыто. Подождите нескольких кварталов." };
  }

  if (!project.isActive) {
    return { ok: false, reason: "Проект приостановлен. Возобновите его перед подачей заявки." };
  }

  if (project.isSuccessful !== null) {
    return { ok: false, reason: "По завершенному проекту нельзя подать новую заявку." };
  }

  if (state.activeSupports.some((item) => item.projectId === project.id && item.supportId === support.id)) {
    return { ok: false, reason: "Эта мера поддержки уже применена к выбранному проекту." };
  }

  if (!support.applicableStages.includes(project.stage)) {
    return { ok: false, reason: "Стадия проекта не соответствует условиям выбранной меры поддержки." };
  }

  if (support.applicableSectors !== "any" && !support.applicableSectors.includes(project.sector)) {
    return { ok: false, reason: "Отрасль проекта не подходит для этой программы." };
  }

  if (support.requiresCofinancing && state.company.cash < 1_500_000) {
    return { ok: false, reason: "Для этой меры нужно софинансирование. Денежный остаток слишком низкий." };
  }

  return { ok: true };
}

export function applySupportEffects(state: GameState, project: Project, support: SupportMeasure): GameState {
  if (support.type === "free_prototyping") {
    const projects = state.projects.map((item) =>
      item.id === project.id
        ? {
            ...item,
            successChanceModifier: item.successChanceModifier + 12,
            spent: item.spent + 350_000,
          }
        : item,
    );

    return updateCharactersOnProjectStageChange(
      {
        ...state,
        projects,
        turnEvents: [
          {
            id: `prototype-${Date.now()}`,
            type: "project_breakthrough",
            message: `Команда использовала прототипирование для проекта «${project.name}». Шанс технического прогресса вырос.`,
          },
        ],
        showTurnSummary: true,
      },
      { projectName: project.name, newStage: project.stage },
    );
  }

  const amountApproved = Math.min(
    support.maxAmount,
    Math.max(600_000, Math.round((project.budgetNeeded - project.spent) * (support.coveragePercent / 100))),
  );
  const activeSupport: ActiveSupport = {
    projectId: project.id,
    supportId: support.id,
    amountApproved,
  };
  const approvalChance = Math.min(
    0.88,
    Math.max(0.35, 0.48 + state.company.reputation / 250 + project.successChanceModifier / 200),
  );
  const approved = Math.random() <= approvalChance;

  const nextState: GameState = approved
    ? {
        ...state,
        company: {
          ...state.company,
          cash: state.company.cash + amountApproved,
          grantsReceived: state.company.grantsReceived + amountApproved,
          reputation: Math.min(100, state.company.reputation + 4),
        },
        activeSupports: [...state.activeSupports, activeSupport],
        projects: state.projects.map((item) =>
          item.id === project.id
            ? { ...item, successChanceModifier: item.successChanceModifier + (support.requiresCofinancing ? 5 : 8) }
            : item,
        ),
        turnEvents: [
          {
            id: `grant-approved-${Date.now()}`,
            type: "grant_approved",
            message: `Заявка «${support.name}» для проекта «${project.name}» одобрена на ${formatMoney(amountApproved)}.`,
          },
        ],
        showTurnSummary: true,
      }
    : {
        ...state,
        company: {
          ...state.company,
          reputation: Math.max(0, state.company.reputation - 3),
        },
        turnEvents: [
          {
            id: `grant-rejected-${Date.now()}`,
            type: "grant_rejected",
            message: `Заявка «${support.name}» для проекта «${project.name}» отклонена. Репутация немного снизилась.`,
          },
        ],
        showTurnSummary: true,
      };

  return updateCharactersOnGrantResult(nextState, {
    approved,
    grantType: support.type,
    projectName: project.name,
  });
}

export function investInProject(state: GameState, projectId: string, amount: number): GameState {
  const investment = Math.min(amount, state.company.cash);
  if (investment <= 0) {
    return state;
  }

  return {
    ...state,
    company: {
      ...state.company,
      cash: state.company.cash - investment,
      ownFundsSpent: state.company.ownFundsSpent + investment,
      reputation: Math.min(100, state.company.reputation + 1),
    },
    projects: state.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            spent: project.spent + investment,
            successChanceModifier: project.successChanceModifier + 2,
          }
        : project,
    ),
    characters: state.characters.map((character) =>
      character.name === "Владислав"
        ? {
            ...character,
            mood: "happy",
            currentMessage: {
              id: `invest-${projectId}`,
              text: "Дополнительное финансирование повышает темп НИОКР. Теперь важно не растратить бюджет на слабые гипотезы.",
            },
          }
        : character,
    ),
  };
}

export function toggleProjectActive(state: GameState, projectId: string): GameState {
  return {
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId ? { ...project, isActive: !project.isActive } : project,
    ),
  };
}

// Generates quarterly costs, random project outcomes and advisor reactions.
export function generateTurnOutcome(state: GameState): GameState {
  const events: GameEvent[] = [];
  let company = { ...state.company };
  let projects = state.projects.map((project) => ({ ...project }));

  // Check for newly unlocked projects
  const nextTurnNum = company.turn + 1;
  projects.forEach((project) => {
    if (project.unlockedAtTurn === nextTurnNum) {
      events.push({
        id: `unlock-${project.id}`,
        type: "info",
        message: `Компания выросла — новое направление открыто: «${project.name}». Изучите его стадию и подберите меры поддержки.`,
      });
    }
  });

  projects = projects.map((project) => {
    if (!project.isActive || project.isSuccessful !== null || project.unlockedAtTurn > company.turn) {
      return project;
    }

    const projectCost = Math.min(BASE_QUARTER_COST + project.trl * 90_000, Math.max(250_000, project.budgetNeeded - project.spent));
    company.cash -= projectCost;
    company.ownFundsSpent += projectCost;
    const spent = project.spent + projectCost;
    const chance = calculateSuccessChance(project, company.reputation);
    const roll = Math.random() * 100;

    if (roll <= chance) {
      const newStage = getNextStage(project.stage);
      const isCommercial = newStage === "commercial";
      events.push({
        id: `progress-${project.id}-${state.company.turn}`,
        type: "project_breakthrough",
        message: `Проект «${project.name}» продвинулся до стадии «${newStage}», уровень технологической готовности вырос.`,
      });
      company.reputation = Math.min(100, company.reputation + (isCommercial ? 8 : 3));
      return {
        ...project,
        stage: newStage,
        trl: Math.min(9, project.trl + 1),
        spent,
        isSuccessful: isCommercial ? true : project.isSuccessful,
        isActive: !isCommercial,
      };
    }

    if (roll > 92) {
      events.push({
        id: `delay-${project.id}-${state.company.turn}`,
        type: "project_delay",
        message: `По проекту «${project.name}» возникла задержка: подрядчик запросил доработки и смету.`,
      });
      company.reputation = Math.max(0, company.reputation - 2);
      return {
        ...project,
        spent,
        successChanceModifier: project.successChanceModifier - 3,
      };
    }

    return { ...project, spent };
  });

  if (Math.random() < 0.16) {
    const ruleEvent = createRuleChangeEvent(state.company.turn);
    events.push(ruleEvent);
    company.reputation = Math.max(0, company.reputation - 1);
  }

  const nextTurn = company.turn + 1;
  company = {
    ...company,
    year: 2026 + Math.floor((nextTurn - 1) / 4),
    turn: nextTurn,
  };

  let nextState: GameState = {
    ...state,
    company,
    projects,
    turnEvents: events.length > 0 ? events : [{ id: `quiet-${state.company.turn}`, type: "info", message: "Квартал прошел без резких внешних событий." }],
    showTurnSummary: true,
    activeSupports: [],
  };

  const progressEvent = events.find((event) => event.type === "project_breakthrough");
  const delayEvent = events.find((event) => event.type === "project_delay");
  if (progressEvent) {
    const projectName = extractProjectName(progressEvent.message);
    nextState = updateCharactersOnProjectStageChange(nextState, {
      projectName,
      newStage: projects.find((project) => project.name === projectName)?.stage ?? "rnd",
    });
  } else if (delayEvent) {
    nextState = {
      ...nextState,
      characters: updateCharacterMessages(nextState.characters, [
        {
          name: "Екатерина",
          mood: "thinking",
          text: "Задержка снижает конкурсную позицию. Проверьте календарный план и не подавайте заявку с неустойчивой сметой.",
        },
        {
          name: "Владислав",
          mood: "sad",
          text: "Технический риск подтвердился. Нужен короткий цикл испытаний и понятные критерии готовности прототипа.",
        },
      ]),
    };
  }

  if (nextState.company.cash < LOW_CASH_THRESHOLD) {
    nextState = updateCharactersOnLowCash(nextState);
  }

  if (nextState.company.cash < 0) {
    nextState = {
      ...nextState,
      isGameOver: true,
      turnEvents: [
        ...nextState.turnEvents,
        {
          id: `bankrupt-${state.company.turn}`,
          type: "info",
          message: "Денежный поток ушел в минус. Партия завершена досрочно.",
        },
      ],
    };
  }

  return nextState;
}

export function updateCharactersOnGrantResult(
  state: GameState,
  params: { approved: boolean; grantType: SupportType; projectName: string },
): GameState {
  const supportName = grantTypeLabel(params.grantType);
  return {
    ...state,
    characters: updateCharacterMessages(state.characters, [
      {
        name: "Екатерина",
        mood: params.approved ? "happy" : "thinking",
        text: params.approved
          ? `Отлично! ${supportName} по проекту «${params.projectName}» одобрен. Можно усилить команду и ускорить НИОКР.`
          : `Заявку по проекту «${params.projectName}» отклонили. Проверьте критерии программы и попробуйте усилить обоснование.`,
      },
      {
        name: "Владислав",
        mood: params.approved ? "happy" : "thinking",
        text: params.approved
          ? "Теперь есть ресурсы на опытно-конструкторские работы и прототипирование."
          : "Техническую часть можно доработать: покажите измеримый уровень технологической готовности, прототип и план коммерциализации.",
      },
    ]),
  };
}

export function updateCharactersOnProjectStageChange(
  state: GameState,
  params: { projectName: string; newStage: ProjectStage },
): GameState {
  const stageAdvice =
    params.newStage === "prototype" || params.newStage === "pilot"
      ? "На этой стадии особенно полезны инжиниринговая субсидия и программы развития."
      : "Проверьте, какие меры поддержки открываются на новой стадии.";

  return {
    ...state,
    characters: updateCharacterMessages(state.characters, [
      {
        name: "Екатерина",
        mood: "happy",
        text: `Проект «${params.projectName}» продвинулся. ${stageAdvice}`,
      },
      {
        name: "Владислав",
        mood: "happy",
        text: `Технический прогресс виден. Зафиксируйте результаты испытаний, чтобы следующий уровень технологической готовности был защищен документально.`,
      },
    ]),
  };
}

export function updateCharactersOnLowCash(state: GameState): GameState {
  return {
    ...state,
    characters: updateCharacterMessages(state.characters, [
      {
        name: "Екатерина",
        mood: "surprised",
        text: "Денежный остаток низкий. Подайте заявку на подходящую субсидию или временно остановите слабый проект.",
      },
      {
        name: "Владислав",
        mood: "sad",
        text: "Без ресурса сложно довести НИОКР до конца. Сфокусируйтесь на проектах с самым высоким уровнем технологической готовности.",
      },
    ]),
  };
}

function updateCharacterMessages(
  characters: CharacterState[],
  updates: Array<{ name: CharacterState["name"]; mood: CharacterState["mood"]; text: string }>,
): CharacterState[] {
  return characters.map((character) => {
    const update = updates.find((item) => item.name === character.name);
    if (!update) {
      return character;
    }

    return {
      ...character,
      mood: update.mood,
      currentMessage: {
        id: `${character.name}-${Date.now()}`,
        text: update.text,
      },
    };
  });
}

function grantTypeLabel(type: SupportType): string {
  switch (type) {
    case "regional_engineering_subsidy":
      return "субсидия ИИЦ";
    case "fasie_start":
      return "грант «Старт-1»";
    case "fasie_commercialization":
      return "грант на коммерциализацию";
    case "fasie_development":
      return "грант развития";
    case "free_prototyping":
      return "прототипирование";
  }
}

function createRuleChangeEvent(turn: number): GameEvent {
  return {
    id: `rule-${turn}`,
    type: "rule_change",
    message: "Конкурсная комиссия уточнила требования к календарным планам. Репутация стала важнее для новых заявок.",
  };
}

function extractProjectName(message: string): string {
  const match = message.match(/«(.+?)»/);
  return match?.[1] ?? "проект";
}

export function resetCharacters(): CharacterState[] {
  return initialCharacters.map((character) => ({ ...character }));
}
