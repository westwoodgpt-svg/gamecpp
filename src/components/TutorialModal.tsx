import { useState } from "react";
import { tutorialTexts, uiTexts } from "../game/gameTexts";

type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const tabs = [
  { id: "goal", label: "🎯 Цель" },
  { id: "projects", label: "🔬 Проекты" },
  { id: "support", label: "💰 Меры поддержки" },
  { id: "tips", label: "💡 Советы" },
] as const;

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["id"]>("goal");

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal wide" role="dialog" aria-modal="true" aria-label="Обучение">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Обучение</p>
            <h2>{tutorialTexts.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className="tab-nav" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "goal" && (
            <div className="tab-pane">
              <div className="modal-intro-card" style={{ marginBottom: "16px", padding: "14px", borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                <p className="eyebrow" style={{ fontSize: "11px", marginBottom: "4px" }}>ИИЦ • ФСИ • ТЕХНОЛОГИЧЕСКИЙ БИЗНЕС</p>
                <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "800", color: "var(--green-dark)" }}>{uiTexts.title}</h3>
                <p className="subtitle" style={{ fontSize: "13px", margin: 0, lineHeight: "1.45" }}>{uiTexts.subtitle}</p>
              </div>
              <p>{tutorialTexts.intro}</p>
              <ul className="tut-bullets">
                <li>📅 В распоряжении вашей компании ровно <strong>16 кварталов (4 года)</strong>.</li>
                <li>⚙️ Каждый ход симулирует один квартал, списывая расходы на активные проекты и принося случайные события.</li>
                <li>🏆 <strong>Итоговый индекс инновационности</strong> зависит от завершенных проектов, привлеченных грантов, репутации и доли собственных средств.</li>
              </ul>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="tab-pane">
              <p>Проекты проходят жизненный цикл от <strong>Идеи</strong> до <strong>Коммерциализации</strong>:</p>
              <ul className="tut-bullets">
                <li>📈 <strong>Уровень технологической готовности</strong> — оценивается от 1 до 9. Продвигайте его вверх для перехода на новые стадии.</li>
                <li>🛑 Проекты можно временно ставить на <strong>Паузу</strong>, чтобы сберечь бюджет во время финансовых трудностей.</li>
                <li>💵 Дополнительное инвестирование (<strong>+1 млн руб.</strong>) повышает шанс успеха НИОКР в текущем квартале.</li>
                <li>🔒 Новые перспективные проекты открываются автоматически по ходу роста компании.</li>
              </ul>
            </div>
          )}

          {activeTab === "support" && (
            <div className="tab-pane">
              <p>Меры поддержки помогают сберечь собственный бюджет и ускорить НИОКР:</p>
              <ul className="tut-bullets">
                <li>🏢 <strong>Федеральные гранты (ФСИ)</strong>: крупные суммы поддержки (до 18 млн), требующие или не требующие софинансирования.</li>
                <li>🌊 <strong>Региональные меры (ЦПП КО)</strong>: субсидии на инжиниринг или бесплатное прототипирование для ускорения прогресса.</li>
                <li>⚠️ Проверяйте условия применимости (отрасль проекта, стадию, лимит средств и наличие денег на софинансирование).</li>
                <li>📈 Шанс одобрения гранта зависит от <strong>Репутации</strong> вашей компании и технического задела.</li>
              </ul>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="tab-pane">
              <p>Рекомендации по успешному прохождению партии:</p>
              <ul className="tut-bullets">
                <li>💵 <strong>Финансовый резерв</strong>: всегда держите запас денег. Расходы списываются автоматически за каждый проект каждый квартал!</li>
                <li>🤝 Слушайте советников: <strong>Екатерина</strong> и <strong>Владислав</strong> меняют эмоции и дают подсказки под текущую ситуацию.</li>
                <li>🔄 Сочетайте гранты: начинайте с ранних безвозмездных грантов (Старт-1) на этапе Идеи/НИОКР, а затем переходите к субсидиям развития и коммерциализации.</li>
              </ul>
            </div>
          )}
        </div>

        <button style={{ marginTop: "18px" }} className="button primary full" type="button" onClick={onClose}>
          {uiTexts.close}
        </button>
      </section>
    </div>
  );
}
