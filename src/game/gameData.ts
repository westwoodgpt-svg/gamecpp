import type { CharacterState, Project, SupportMeasure } from "./gameState";

export const stageLabels = {
  idea: "Идея",
  rnd: "НИОКР",
  prototype: "Прототип",
  pilot: "Пилот",
  commercial: "Коммерциализация",
} as const;

export const sectorLabels = {
  bio: "Биоэкономика",
  med_devices: "Медизделия",
  machinery: "Станкостроение",
  industry: "Промышленность",
  neuronet: "Нейронет",
  other: "Другое",
} as const;

export const stageOrder = ["idea", "rnd", "prototype", "pilot", "commercial"] as const;

// Проекты появляются постепенно: первые два — с самого начала,
// остальные открываются на указанном ходу, создавая ощущение роста компании.
export const initialProjects: Project[] = [
  {
    id: "bio-packaging",
    name: "Биоразлагаемая упаковка из водорослей",
    sector: "bio",
    stage: "idea",
    trl: 2,
    budgetNeeded: 6_000_000,
    spent: 600_000,
    successChanceModifier: 5,
    isActive: true,
    isSuccessful: null,
    unlockedAtTurn: 1,
  },
  {
    id: "med-sensor",
    name: "Носимый датчик мониторинга реабилитации",
    sector: "med_devices",
    stage: "rnd",
    trl: 3,
    budgetNeeded: 9_500_000,
    spent: 1_400_000,
    successChanceModifier: 0,
    isActive: true,
    isSuccessful: null,
    unlockedAtTurn: 1,
  },
  {
    id: "cnc-module",
    name: "Модуль диагностики станков с ЧПУ",
    sector: "machinery",
    stage: "prototype",
    trl: 5,
    budgetNeeded: 12_000_000,
    spent: 4_200_000,
    successChanceModifier: 8,
    isActive: true,
    isSuccessful: null,
    unlockedAtTurn: 4,
  },
  {
    id: "industrial-vision",
    name: "Система машинного зрения для производства",
    sector: "industry",
    stage: "rnd",
    trl: 4,
    budgetNeeded: 8_000_000,
    spent: 2_000_000,
    successChanceModifier: 3,
    isActive: true,
    isSuccessful: null,
    unlockedAtTurn: 7,
  },
  {
    id: "neuro-analytics",
    name: "Нейросетевой анализ производственных простоев",
    sector: "neuronet",
    stage: "pilot",
    trl: 6,
    budgetNeeded: 10_000_000,
    spent: 5_500_000,
    successChanceModifier: 10,
    isActive: true,
    isSuccessful: null,
    unlockedAtTurn: 11,
  },
];

export const supportMeasures: SupportMeasure[] = [
  {
    id: "iic-engineering-subsidy",
    name: "Субсидия ЦПП КО на инжиниринговые услуги",
    type: "regional_engineering_subsidy",
    description:
      "Компенсация до 50% затрат на услуги инжинирингового центра ЦПП КО «Мой бизнес». В игровой модели лимит поддержки составляет 2 000 000 рублей.",
    maxAmount: 2_000_000,
    coveragePercent: 50,
    requiresCofinancing: true,
    applicableStages: ["rnd", "prototype", "pilot"],
    applicableSectors: "any",
  },
  {
    id: "fasie-start-1",
    name: "Грант ФСИ «Старт-1»",
    type: "fasie_start",
    description:
      "Ранняя поддержка НИОКР от Фонда содействия инновациям (ФСИ) — до 4 000 000 рублей без обязательного софинансирования. Лучше всего работает на стадии идеи и первых исследований.",
    maxAmount: 4_000_000,
    coveragePercent: 100,
    requiresCofinancing: false,
    applicableStages: ["idea", "rnd"],
    applicableSectors: "any",
  },
  {
    id: "fasie-development-nti",
    name: "Грант ФСИ «Развитие-НТИ»",
    type: "fasie_development",
    description:
      "Крупная программа ФСИ по развитию технологического продукта в рамках Национальной технологической инициативы. В игре ограничена 18 000 000 рублей и требует софинансирования.",
    maxAmount: 18_000_000,
    coveragePercent: 70,
    requiresCofinancing: true,
    applicableStages: ["prototype", "pilot", "commercial"],
    applicableSectors: ["industry", "neuronet", "machinery"],
  },
  {
    id: "fasie-commercialization-bio",
    name: "Грант ФСИ «Коммерциализация-Био»",
    type: "fasie_commercialization",
    description:
      "Программа ФСИ поддержки вывода биотехнологических решений на рынок. В игре покрывает часть затрат зрелых проектов и требует собственных вложений.",
    maxAmount: 14_000_000,
    coveragePercent: 65,
    requiresCofinancing: true,
    applicableStages: ["prototype", "pilot", "commercial"],
    applicableSectors: ["bio", "med_devices"],
  },
  {
    id: "free-prototyping",
    name: "Бесплатное прототипирование ЦМИТ/ЦПП КО",
    type: "free_prototyping",
    description:
      "Льготная 3D-печать, сканирование и быстрые макеты через Центр молодёжного инновационного творчества (ЦМИТ) при ЦПП КО. Денежной выплаты нет, зато повышается шанс технического прорыва.",
    maxAmount: 0,
    coveragePercent: 100,
    requiresCofinancing: false,
    applicableStages: ["idea", "rnd", "prototype"],
    applicableSectors: "any",
  },
];

export const initialCharacters: CharacterState[] = [
  {
    name: "Екатерина",
    role: "advisor",
    mood: "neutral",
    currentMessage: {
      id: "ekaterina-start",
      text: "Начнём с двух проектов — не распыляйтесь. Сначала определите их стадии и подберите подходящие меры поддержки ФСИ или ЦПП КО.",
    },
  },
  {
    name: "Владислав",
    role: "engineer",
    mood: "thinking",
    currentMessage: {
      id: "vlad-start",
      text: "Смотрите на уровень технологической готовности и бюджет. Новые направления будут открываться по мере роста компании — сосредоточьтесь на текущих.",
    },
  },
];
