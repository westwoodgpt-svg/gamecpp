import { useEffect, useRef, useState } from "react";

// Speed in ms per character. Lower = faster.
const CHAR_SPEED_MS = 22;

export function useTypewriter(text: string) {
  const [displayed, setDisplayed] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const indexRef = useRef(0);
  const textRef = useRef(text);

  useEffect(() => {
    // When text changes, restart the typewriter
    if (text === textRef.current && displayed.length > 0) {
      return;
    }
    textRef.current = text;
    indexRef.current = 0;
    setDisplayed("");
    setIsSpeaking(true);
    clearTimeout(timerRef.current);

    const tick = () => {
      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplayed(next);
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(tick, CHAR_SPEED_MS);
      } else {
        setIsSpeaking(false);
      }
    };

    timerRef.current = setTimeout(tick, CHAR_SPEED_MS);
    return () => clearTimeout(timerRef.current);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return { displayed, isSpeaking };
}
