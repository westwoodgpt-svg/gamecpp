import { characterHints } from "../game/gameTexts";
import type { CharacterMood, CharacterState } from "../game/gameState";
import { GameCharacter } from "./GameCharacter";

type AdvisorEkaterinaProps = {
  character: CharacterState;
  isAnimated: boolean;
};

function AdvisorAvatar({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy";
  const isSad = mood === "sad";
  const isSurprised = mood === "surprised";
  const isThinking = mood === "thinking";

  // Mouth shapes
  const mouthPath = isHappy
    ? "M32 46 Q40 54 48 46"
    : isSad
      ? "M32 50 Q40 43 48 50"
      : isSurprised
        ? "M36 46 A4 5 0 0 0 44 46 A4 5 0 0 0 36 46"
        : isThinking
          ? "M34 47 Q40 45 46 47"
          : "M33 46 Q40 50 47 46";

  // Eyebrow angles
  const leftBrowD = isThinking
    ? "M27 25 Q33 22 37 23"
    : isSad
      ? "M27 24 Q33 26 37 25"
      : isSurprised
        ? "M27 21 Q33 18 37 20"
        : "M27 24 Q33 21 37 22";
  const rightBrowD = isThinking
    ? "M43 23 Q47 22 53 25"
    : isSad
      ? "M43 25 Q47 26 53 24"
      : isSurprised
        ? "M43 20 Q47 18 53 21"
        : "M43 22 Q47 21 53 24";

  // Cheek blush only when happy
  const blushOpacity = isHappy ? 0.28 : 0;

  return (
    <svg className="char-svg char-svg--advisor" viewBox="0 0 80 110" aria-hidden="true">
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffdfc9" />
          <stop offset="100%" stop-color="#f5c9a8" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#268456" />
          <stop offset="100%" stop-color="#144d32" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4a3525" />
          <stop offset="100%" stop-color="#1c120c" />
        </linearGradient>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(31, 107, 71, 0.28)" />
          <stop offset="100%" stop-color="rgba(31, 107, 71, 0)" />
        </radialGradient>
      </defs>

      {/* Background Glow */}
      <circle cx="40" cy="40" r="32" fill="url(#bgGlow)" />

      {/* Shadow */}
      <ellipse cx="40" cy="105" rx="24" ry="4" fill="rgba(31,107,71,0.13)" />

      {/* Body / jacket */}
      <path
        d="M14 72 Q20 60 30 57 L40 63 L50 57 Q60 60 66 72 L68 110 L12 110 Z"
        fill="url(#jacketGrad)"
        stroke="#144d32"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Jacket lapels */}
      <path d="M30 57 L36 72 L40 66 L44 72 L50 57" fill="#f7f4ec" opacity="0.9" />
      {/* Jacket buttons */}
      <circle cx="40" cy="76" r="1.6" fill="#144d32" opacity="0.7" />
      <circle cx="40" cy="83" r="1.6" fill="#144d32" opacity="0.7" />

      {/* Left arm */}
      <path
        d="M14 72 Q8 80 10 95 L18 93 Q18 82 22 76 Z"
        fill="url(#jacketGrad)"
        stroke="#144d32"
        strokeWidth="1"
      />
      {/* Left hand */}
      <ellipse cx="14" cy="96" rx="5" ry="6" fill="url(#skinGrad)" />

      {/* Right arm — holding a small document/tablet */}
      <path
        d="M66 72 Q72 80 70 95 L62 93 Q62 82 58 76 Z"
        fill="url(#jacketGrad)"
        stroke="#144d32"
        strokeWidth="1"
      />
      {/* Tablet */}
      <rect x="60" y="83" width="14" height="18" rx="2.5" fill="#eef5f1" stroke="#7ab09c" strokeWidth="1.2" />
      <path d="M62 87 H72 M62 91 H70 M62 95 H68" stroke="#7ab09c" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="67" cy="99" r="1" fill="#7ab09c" />

      {/* Neck */}
      <rect x="35" y="52" width="10" height="10" rx="3" fill="url(#skinGrad)" />

      {/* Head */}
      <ellipse cx="40" cy="34" rx="19" ry="21" fill="url(#skinGrad)" />

      {/* Hair — styled bun / shoulder length dark hair */}
      <ellipse cx="40" cy="16" rx="19" ry="10" fill="url(#hairGrad)" />
      <path
        d="M21 22 C18 14 22 8 30 7 C36 5 44 5 50 7 C58 8 62 14 59 22 C54 14 46 11 40 11 C34 11 26 14 21 22 Z"
        fill="url(#hairGrad)"
      />
      {/* Side hair strands */}
      <path d="M21 22 C16 32 17 44 20 50" fill="none" stroke="#241712" strokeWidth="7" strokeLinecap="round" />
      <path d="M59 22 C64 32 63 44 60 50" fill="none" stroke="#241712" strokeWidth="7" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="21" cy="34" rx="3.5" ry="4.5" fill="#f0b898" />
      <ellipse cx="59" cy="34" rx="3.5" ry="4.5" fill="#f0b898" />
      {/* Earrings */}
      <circle cx="21" cy="38" r="1.5" fill="#d4a017" />
      <circle cx="59" cy="38" r="1.5" fill="#d4a017" />

      {/* Eyebrows */}
      <path d={leftBrowD} stroke="#241712" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d={rightBrowD} stroke="#241712" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Eyes — whites */}
      <ellipse cx="33" cy="31" rx="4" ry="5" fill="#fff" />
      <ellipse cx="47" cy="31" rx="4" ry="5" fill="#fff" />
      {/* Irises */}
      <circle cx="33.5" cy="32" r="2.8" fill="#3d6b82" />
      <circle cx="47.5" cy="32" r="2.8" fill="#3d6b82" />
      {/* Pupils */}
      <circle cx="33.8" cy="32" r="1.4" fill="#1a1a1a" />
      <circle cx="47.8" cy="32" r="1.4" fill="#1a1a1a" />
      {/* Eye shine */}
      <circle cx="34.8" cy="31" r="0.7" fill="#fff" />
      <circle cx="48.8" cy="31" r="0.7" fill="#fff" />

      {/* Glasses frames */}
      <rect x="27.5" y="26.5" width="11" height="9" rx="3.5" fill="none" stroke="#3d4f5c" strokeWidth="1.4" />
      <rect x="41.5" y="26.5" width="11" height="9" rx="3.5" fill="none" stroke="#3d4f5c" strokeWidth="1.4" />
      <path d="M38.5 31 H41.5" stroke="#3d4f5c" strokeWidth="1.4" />
      <path d="M27.5 31 L24 31" stroke="#3d4f5c" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M52.5 31 L56 31" stroke="#3d4f5c" strokeWidth="1.2" strokeLinecap="round" />

      {/* Nose */}
      <path d="M38 37 Q40 40 42 37" stroke="#d4906a" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="29" cy="38" rx="5" ry="3" fill="#e87c7c" opacity={blushOpacity} />
      <ellipse cx="51" cy="38" rx="5" ry="3" fill="#e87c7c" opacity={blushOpacity} />

      {/* Mouth */}
      <path d={mouthPath} stroke="#8b4f45" strokeWidth="2" fill="none" strokeLinecap="round" />
      {isHappy && <path d="M32 46 Q40 54 48 46" fill="rgba(220,130,120,0.15)" />}
    </svg>
  );
}

export function AdvisorEkaterina({ character, isAnimated }: AdvisorEkaterinaProps) {
  return (
    <GameCharacter
      name={character.name}
      roleLabel="советник"
      mood={character.mood}
      message={character.currentMessage}
      isAnimated={isAnimated}
      detailHint={characterHints.advisor}
      variant="advisor"
      avatar={<AdvisorAvatar mood={character.mood} />}
    />
  );
}
