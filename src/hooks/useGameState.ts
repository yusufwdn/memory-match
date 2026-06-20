/**
 * useGameState is the core game logic hook.
 *
 * It will own ALL game state: the card array, move count,
 * match count, and completion status.
 *
 * Components do not manage state themselves — they receive data
 * from this hook and call the handlers it returns.
 *
 * This pattern is called "lifting state up". The state lives
 * at the top (page.tsx) and flows down to components as props.
 *
 * Phases that will build this hook:
 *   Phase 2  — card generation
 *   Phase 4  — flip logic
 *   Phase 5  — match detection
 *   Phase 6  — completion detection
 *   Phase 8  — score calculation
 *   Phase 9  — local storage persistence
 */
export function useGameState() {
  // Implementation begins in Phase 2.
  return {};
}
