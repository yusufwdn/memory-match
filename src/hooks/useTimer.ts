/**
 * useTimer manages the game clock.
 *
 * It starts counting seconds when the first card is flipped
 * and stops when the game is complete.
 *
 * This is a separate hook because timer logic involves
 * useEffect and setInterval — isolating it keeps useGameState clean.
 *
 * Phase 7 will implement this hook.
 */
export function useTimer() {
  // Implementation begins in Phase 7.
  return { elapsedTime: 0 };
}
