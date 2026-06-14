import { characterHints } from "../game/gameTexts";
import type { CharacterMood, CharacterState } from "../game/gameState";
import { GameCharacter } from "./GameCharacter";

type EngineerVladProps = {
  character: CharacterState;
  isAnimated: boolean;
};

function EngineerAvatar({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking: boolean }) {
  const isHappy = mood === "happy";
  const isSad = mood === "sad";
  const isSurprised = mood === "surprised";
  const isThinking = mood === "thinking";

  // Mouth shapes
  const mouthPath = isHappy
    ? "M32 47 Q40 56 48 47"
    : isSad
      ? "M32 52 Q40 44 48 52"
      : isSurprised
        ? "M36 47 A4 5 0 0 0 44 47 A4 5 0 0 0 36 47"
        : isThinking
          ? "M34 49 Q40 47 46 49"
          : "M33 47 Q40 51 47 47";

  // Eyebrows
  const leftBrowD = isThinking
    ? "M27 25 Q33 22 37 24"
    : isSad
      ? "M27 25 Q33 27 37 26"
      : isSurprised
        ? "M27 21 Q33 18 37 20"
        : "M27 24 Q33 21 37 23";
  const rightBrowD = isThinking
    ? "M43 24 Q47 22 53 25"
    : isSad
      ? "M43 26 Q47 27 53 25"
      : isSurprised
        ? "M43 20 Q47 18 53 21"
        : "M43 23 Q47 21 53 24";

  return (
    <svg className="char-svg char-svg--engineer" viewBox="0 0 80 110" aria-hidden="true">
      <defs>
        <linearGradient id="vladSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffe3cc" />
          <stop offset="100%" stop-color="#efb98a" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffd55c" />
          <stop offset="100%" stop-color="#b88307" />
        </linearGradient>
        <linearGradient id="vladJacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#405261" />
          <stop offset="100%" stop-color="#1c2830" />
        </linearGradient>
        <radialGradient id="vladBgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(184, 116, 18, 0.28)" />
          <stop offset="100%" stop-color="rgba(184, 116, 18, 0)" />
        </radialGradient>
      </defs>

      {/* Background Glow */}
      <circle cx="40" cy="40" r="32" fill="url(#vladBgGlow)" />

      {/* Shadow */}
      <ellipse cx="40" cy="105" rx="24" ry="4" fill="rgba(184,116,18,0.13)" />

      {/* Body / work jacket */}
      <path
        d="M14 72 Q20 60 30 57 L40 63 L50 57 Q60 60 66 72 L68 110 L12 110 Z"
        fill="url(#vladJacketGrad)"
        stroke="#1c2830"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Hi-vis stripe */}
      <rect x="12" y="74" width="56" height="5" rx="1" fill="#e8c84a" opacity="0.9" />
      <rect x="12" y="82" width="56" height="5" rx="1" fill="#e8c84a" opacity="0.9" />

      {/* Chest pocket */}
      <rect x="43" y="62" width="10" height="8" rx="2" fill="#243038" stroke="#1c2830" strokeWidth="0.8" />
      <path d="M44 66 H52" stroke="#e8c84a" strokeWidth="0.9" strokeLinecap="round" />

      {/* Left arm */}
      <path
        d="M14 72 Q8 80 10 95 L18 93 Q18 82 22 76 Z"
        fill="url(#vladJacketGrad)"
        stroke="#1c2830"
        strokeWidth="1"
      />
      {/* Left hand */}
      <ellipse cx="14" cy="96" rx="5" ry="6" fill="url(#vladSkinGrad)" />

      {/* Right arm holding wrench */}
      <path
        d="M66 72 Q72 80 70 94 L62 92 Q62 82 58 76 Z"
        fill="url(#vladJacketGrad)"
        stroke="#1c2830"
        strokeWidth="1"
      />
      {/* Wrench */}
      <rect x="63" y="84" width="5" height="16" rx="2" fill="#8fa0ac" stroke="#627585" strokeWidth="1" />
      <ellipse cx="65.5" cy="83" rx="4" ry="3.5" fill="none" stroke="#8fa0ac" strokeWidth="2" />
      <ellipse cx="65.5" cy="101" rx="4" ry="3.5" fill="none" stroke="#8fa0ac" strokeWidth="2" />

      {/* Neck */}
      <rect x="35" y="52" width="10" height="10" rx="3" fill="url(#vladSkinGrad)" />

      {/* Head */}
      <ellipse cx="40" cy="34" rx="19" ry="21" fill="url(#vladSkinGrad)" />

      {/* Hard hat */}
      <path
        d="M21 25 C21 12 59 12 59 25 L62 30 L18 30 Z"
        fill="url(#helmetGrad)"
        stroke="#b88307"
        strokeWidth="1.2"
      />
      <rect x="18" y="28" width="44" height="5" rx="2.5" fill="url(#helmetGrad)" stroke="#b88307" strokeWidth="1" />
      {/* Hat brim shadow */}
      <path d="M18 33 L62 33" stroke="#b88307" strokeWidth="0.8" opacity="0.4" />

      {/* Short dark hair (visible below hat) */}
      <path d="M21 30 C19 34 20 40 21 42" fill="none" stroke="#4a3020" strokeWidth="5" strokeLinecap="round" />
      <path d="M59 30 C61 34 60 40 59 42" fill="none" stroke="#4a3020" strokeWidth="5" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="21" cy="34" rx="3.5" ry="4.5" fill="#e0a878" />
      <ellipse cx="59" cy="34" rx="3.5" ry="4.5" fill="#e0a878" />

      {/* Eyebrows */}
      <path d={leftBrowD} stroke="#4a3020" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={rightBrowD} stroke="#4a3020" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Eyes — whites */}
      <ellipse cx="33" cy="31" rx="4" ry="5" fill="#fff" />
      <ellipse cx="47" cy="31" rx="4" ry="5" fill="#fff" />
      {/* Irises */}
      <circle cx="33.5" cy="32" r="2.8" fill="#5a7a4a" />
      <circle cx="47.5" cy="32" r="2.8" fill="#5a7a4a" />
      {/* Pupils */}
      <circle cx="33.8" cy="32" r="1.4" fill="#1a1a1a" />
      <circle cx="47.8" cy="32" r="1.4" fill="#1a1a1a" />
      {/* Eye shine */}
      <circle cx="34.8" cy="31" r="0.7" fill="#fff" />
      <circle cx="48.8" cy="31" r="0.7" fill="#fff" />

      {/* Nose */}
      <path d="M37 37 Q40 41 43 37" stroke="#d4906a" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Stubble */}
      <path d="M31 44 Q40 50 49 44" fill="rgba(74,48,32,0.15)" stroke="none" />
      <path d="M30 43 Q40 49 50 43" fill="none" stroke="rgba(74,48,32,0.3)" strokeWidth="0.6" strokeDasharray="1.5 2" />

      {/* Mouth — static shape when silent, animated ellipse when speaking */}
      {isSpeaking ? (
        <ellipse
          cx="40" cy="49" rx="6" ry="3.5"
          fill="rgba(80,30,20,0.18)"
          stroke="#7a4535"
          strokeWidth="1.5"
          className="char-mouth-speaking"
        />
      ) : (
        <>
          <path d={mouthPath} stroke="#7a4535" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {isHappy && <path d="M32 47 Q40 56 48 47" fill="rgba(200,120,100,0.12)" />}
        </>
      )}

      {/* Safety glasses on hat (thinking/working mode) */}
      {isThinking && (
        <g transform="translate(0,-2)">
          <rect x="28" y="27" width="10" height="6" rx="2.5" fill="none" stroke="#5a8aa8" strokeWidth="1.2" opacity="0.7" />
          <rect x="42" y="27" width="10" height="6" rx="2.5" fill="none" stroke="#5a8aa8" strokeWidth="1.2" opacity="0.7" />
          <path d="M38 30 H42" stroke="#5a8aa8" strokeWidth="1.2" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

export function EngineerVlad({ character, isAnimated }: EngineerVladProps) {
  return (
    <GameCharacter
      name="Владислав"
      roleLabel="инженер"
      mood={character.mood}
      message={character.currentMessage}
      isAnimated={isAnimated}
      detailHint={characterHints.engineer}
      variant="engineer"
      avatar={(isSpeaking) => <EngineerAvatar mood={character.mood} isSpeaking={isSpeaking} />}
    />
  );
}
