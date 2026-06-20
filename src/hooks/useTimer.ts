import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { GameState } from "@/types/game";

/**
 * useTimer ticks elapsedTime every second while the game is running.
 *
 * It starts when startTime is set (first card flip) and stops when
 * isComplete becomes true.
 *
 * Why compute from (Date.now() - startTime) instead of incrementing?
 * Incrementing by 1 each tick drifts over time — setInterval is not
 * perfectly precise and can fire slightly late. Computing from the
 * original startTime stays accurate no matter how long the game runs.
 *
 * The hook writes directly to setGameState so elapsedTime stays
 * inside GameState — ready to be persisted in Phase 9.
 */
export function useTimer(
  startTime: number | null,
  isComplete: boolean,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  useEffect(() => {
    // No-op: game hasn't started yet, or it's already over
    if (startTime === null || isComplete) return;

    const interval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        // Floor to whole seconds for display; computed from origin to avoid drift
        elapsedTime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    // Cleanup function: React calls this before re-running the effect
    // (when startTime or isComplete changes) and when the component unmounts.
    // Without this, every state change would add another interval on top
    // of the existing one — memory leak and runaway ticking.
    return () => clearInterval(interval);
  }, [startTime, isComplete, setGameState]);
}
