import { useEffect, useReducer, useState } from "react";
import { CharactersPanel } from "./components/CharactersPanel";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { ProjectsPanel } from "./components/ProjectsPanel";
import { SupportPanel } from "./components/SupportPanel";
import { TutorialModal } from "./components/TutorialModal";
import { TurnSummary } from "./components/TurnSummary";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { QuarterTransition } from "./components/QuarterTransition";
import { createInitialState, gameReducer, restoreGameState } from "./game/gameState";

const STORAGE_KEY = "kaliningrad-innovation-game";
const TUTORIAL_KEY = "kaliningrad-innovation-tutorial-seen";
const THEME_KEY = "kaliningrad-innovation-theme";

function loadInitialState() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createInitialState();
  }

  try {
    return restoreGameState(JSON.parse(saved)) ?? createInitialState();
  } catch {
    return createInitialState();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadInitialState);
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => window.localStorage.getItem(TUTORIAL_KEY) !== "1");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "support">("projects");
  const [lastSeenTurn, setLastSeenTurn] = useState(state.company.turn);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (state.showTurnSummary && state.company.turn > lastSeenTurn) {
      setShowTransition(true);
      setLastSeenTurn(state.company.turn);
    } else if (!state.showTurnSummary) {
      setLastSeenTurn(state.company.turn);
      setShowTransition(false);
    }
  }, [state.showTurnSummary, state.company.turn, lastSeenTurn]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const closeTutorial = () => {
    window.localStorage.setItem(TUTORIAL_KEY, "1");
    setIsTutorialOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleStartNewGame = () => {
    dispatch({ type: "START_NEW_GAME" });
    setIsGameStarted(true);
  };

  const handleContinueGame = () => {
    setIsGameStarted(true);
  };

  const hasSave = window.localStorage.getItem(STORAGE_KEY) !== null;

  if (!isGameStarted) {
    return (
      <main className="app-shell welcome-shell">
        <WelcomeScreen
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          hasSave={hasSave}
        />
      </main>
    );
  }

  return (
    <main className={`app-shell${state.isGameOver ? " app-shell--game-over" : ""}`}>
      <Header
        state={state}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewGame={handleStartNewGame}
        onEndTurn={() => dispatch({ type: "END_TURN" })}
        onGoToMenu={() => setIsGameStarted(false)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />
      <Dashboard state={state} />
      <div className="game-layout">
        <CharactersPanel state={state} />
        <div className="main-workspace">
          <div className="workspace-tabs" role="tablist">
            <button
              className={`workspace-tab-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
              role="tab"
              aria-selected={activeTab === "projects"}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Проекты компании
            </button>
            <button
              className={`workspace-tab-btn ${activeTab === "support" ? "active" : ""}`}
              onClick={() => setActiveTab("support")}
              role="tab"
              aria-selected={activeTab === "support"}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Меры поддержки
            </button>
          </div>
          <div className="workspace-content">
            {activeTab === "projects" ? (
              <ProjectsPanel
                state={state}
                onInvest={(projectId, amount) => dispatch({ type: "INVEST_IN_PROJECT", projectId, amount })}
                onToggleActive={(projectId) => dispatch({ type: "TOGGLE_PROJECT_ACTIVE", projectId })}
              />
            ) : (
              <SupportPanel
                state={state}
                onApply={(projectId, supportId) => dispatch({ type: "APPLY_SUPPORT_TO_PROJECT", projectId, supportId })}
              />
            )}
          </div>
        </div>
      </div>
      {showTransition ? (
        <QuarterTransition state={state} onComplete={() => setShowTransition(false)} />
      ) : (
        <TurnSummary
          state={state}
          onContinue={() => dispatch({ type: "CLOSE_TURN_SUMMARY" })}
          onNewGame={handleStartNewGame}
        />
      )}
      <TutorialModal isOpen={isTutorialOpen} onClose={closeTutorial} />
    </main>
  );
}
