import { useState } from "react";
import { tutorialTexts, uiTexts } from "../game/gameTexts";

type WelcomeScreenProps = {
  onStartNewGame: () => void;
  onContinueGame: () => void;
  hasSave: boolean;
};

const rulesTabs = [
  { id: "intro", label: "🎯 Цель" },
  { id: "rules", label: "⚙️ Правила" },
  { id: "score", label: "🏆 Победа" },
] as const;

export function WelcomeScreen({ onStartNewGame, onContinueGame, hasSave }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState<typeof rulesTabs[number]["id"]>("intro");

  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <p className="eyebrow">ИИЦ • ФСИ • ТЕХНОЛОГИЧЕСКИЙ БИЗНЕС · Бизнес-симулятор</p>
        <h1>{uiTexts.title}</h1>
        <p className="subtitle">{uiTexts.subtitle}</p>

        <div className="rules-section">
          <div className="tab-nav" role="tablist">
            {rulesTabs.map((tab) => (
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

          <div className="rules-content">
            {activeTab === "intro" && (
              <div className="tab-pane">
                <p>{tutorialTexts.intro}</p>
                <ul className="tut-bullets">
                  <li>Управляйте бюджетом, репутацией и проектами.</li>
                  <li>Доведите разработки от стадии Идеи до Коммерциализации.</li>
                  <li>Избегайте банкротства (баланс ниже 0).</li>
                </ul>
              </div>
            )}

            {activeTab === "rules" && (
              <div className="tab-pane">
                <ul className="tut-bullets">
                  <li>💼 <strong>Проекты</strong>: инвестируйте свои средства (+1 млн) и повышайте уровень технологической готовности.</li>
                  <li>🏢 <strong>Гранты ФСИ</strong>: подавайте заявки на финансовую поддержку. Учитывайте условия и софинансирование.</li>
                  <li>🌊 <strong>ЦПП КО</strong>: используйте региональные субсидии и льготное прототипирование.</li>
                </ul>
              </div>
            )}

            {activeTab === "score" && (
              <div className="tab-pane">
                <ul className="tut-bullets">
                  <li>📊 <strong>Индекс инновационности</strong>: ваш главный итоговый счет.</li>
                  <li>📈 Индекс растет при успешном выводе проектов на рынок и привлечении грантов.</li>
                  <li>💵 Доля собственных вложений компании также увеличивает устойчивость и итоговый индекс.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="welcome-actions">
          {hasSave ? (
            <>
              <button className="button primary large" type="button" onClick={onContinueGame}>
                ▶ Продолжить игру
              </button>
              <button className="button ghost large" type="button" onClick={onStartNewGame}>
                ♻ Начать заново
              </button>
            </>
          ) : (
            <button className="button primary large" type="button" onClick={onStartNewGame}>
              🎮 Начать игру
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
