import { uiTexts } from "../game/gameTexts";
import type { GameState } from "../game/gameState";

type HeaderProps = {
  state: GameState;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNewGame: () => void;
  onEndTurn: () => void;
  onGoToMenu: () => void;
  onOpenTutorial: () => void;
};

export function Header({ state, theme, onToggleTheme, onNewGame, onEndTurn, onGoToMenu, onOpenTutorial }: HeaderProps) {
  const turn = Math.min(state.company.turn, state.maxTurns);
  const progress = Math.round((turn / state.maxTurns) * 100);
  const quarter = ((state.company.turn - 1) % 4) + 1;

  return (
    <header className="app-header">
      <div className="header-brand-block">
        <span className="header-logo-text">Инновационный рывок</span>
        <span className="company-chip">{state.company.name}</span>
      </div>

      <div className="header-progress-block">
        <div className="quarter-track" aria-label={`Прогресс партии: ${turn} из ${state.maxTurns} ходов`}>
          <div className="quarter-fill" style={{ width: `${progress}%` }} />
          <span>
            {state.company.year} год · Квартал {quarter} · Ход {turn}/{state.maxTurns}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="button icon-button theme-toggle"
          type="button"
          onClick={onToggleTheme}
          title={theme === "light" ? "Включить темную тему" : "Включить светлую тему"}
          aria-label="Переключение темы"
        >
          {theme === "light" ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <button className="button ghost small" type="button" onClick={onOpenTutorial} title="Открыть справку по игре">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Справка
        </button>
        <button className="button ghost small" type="button" onClick={onGoToMenu} title="Вернуться в главное меню">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          В меню
        </button>
        <button className="button ghost small" type="button" onClick={onNewGame}>
          Новая игра
        </button>
        <button className="button primary small" type="button" onClick={onEndTurn} disabled={state.isGameOver}>
          {state.isGameOver ? "Завершено" : "Завершить квартал"}
          {!state.isGameOver && (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "2px" }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
