import type { ReactNode } from "react";
import type { CharacterMessage, CharacterMood } from "../game/gameState";
import { useTypewriter } from "../hooks/useTypewriter";

export interface GameCharacterProps {
  name: string;
  roleLabel: string;
  mood: CharacterMood;
  message: CharacterMessage | null;
  isAnimated?: boolean;
  detailHint: string;
  variant: "advisor" | "engineer";
  // render-function so isSpeaking can reach inside the SVG avatar
  avatar: (isSpeaking: boolean) => ReactNode;
}

export function GameCharacter({
  name,
  roleLabel,
  mood,
  message,
  isAnimated = false,
  detailHint,
  variant,
  avatar,
}: GameCharacterProps) {
  const rawText = message?.text ?? "Готовлю рекомендацию по следующему ходу.";
  const { displayed, isSpeaking } = useTypewriter(rawText);

  return (
    <article
      className={`character character--${variant} mood-${mood}${isAnimated ? " animated" : ""}${isSpeaking ? " is-speaking" : ""}`}
      title={detailHint}
    >
      <div className={`char-avatar char-avatar--${variant}`} aria-hidden="true">
        {avatar(isSpeaking)}
      </div>
      <div className="character-copy">
        <div className="character-name-row">
          <h3>{name}</h3>
          <div className="character-badges-row">
            <span className="role-badge">{roleLabel}</span>
            <span className="char-help-trigger" title={detailHint} aria-label="Справка">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
          </div>
        </div>
        <div className="speech-bubble">
          <p className="character-message">
            {displayed}
            {isSpeaking && <span className="typewriter-cursor" aria-hidden="true" />}
          </p>
        </div>
      </div>
    </article>
  );
}
