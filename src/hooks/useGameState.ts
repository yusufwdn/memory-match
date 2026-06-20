import { useState, useCallback } from "react";
import { generateCards } from "@/lib/cardUtils";
import type { Card, Difficulty, GameState } from "@/types/game";

/**
 * useGameState is the single owner of all game logic and state.
 *
 * It returns:
 *   - gameState: the current state of the game (cards, moves, etc.)
 *   - difficulty: the active difficulty setting
 *   - handlers: functions components call to trigger state changes
 *
 * Components never modify state directly — they always call a handler.
 * This keeps the data flow predictable and easy to debug.
 */
export function useGameState() {
  // ─── Difficulty ─────────────────────────────────────────────────────────────

  // useState returns a pair: [currentValue, setterFunction].
  // When you call the setter, React re-renders any component using this value.
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // ─── Game State ──────────────────────────────────────────────────────────────

  // The full game state is stored as a single object.
  // Grouping related state together makes it easier to reset all at once.
  const [gameState, setGameState] = useState<GameState>(() =>
    buildInitialState("easy")
  );

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Starts a brand new game with a freshly generated card set.
   * Called when the player clicks "New Game".
   *
   * useCallback wraps the function so React doesn't recreate it
   * on every render — only when 'difficulty' changes.
   * This is a performance optimisation, but also a good habit.
   */
  const handleNewGame = useCallback((newDifficulty?: Difficulty) => {
    const activeDifficulty = newDifficulty ?? difficulty;
    setDifficulty(activeDifficulty);
    setGameState(buildInitialState(activeDifficulty));
  }, [difficulty]);

  /**
   * Restarts the current game with a new shuffle of the same difficulty.
   * The card symbols stay the same but their positions are reshuffled.
   * Called when the player clicks "Restart".
   */
  const handleRestart = useCallback(() => {
    setGameState(buildInitialState(difficulty));
  }, [difficulty]);

  return {
    gameState,
    difficulty,
    handleNewGame,
    handleRestart,
    // setGameState is exposed so Phase 4 (flip logic) can update cards.
    setGameState,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the initial GameState for a given difficulty.
 *
 * This is a plain function (not a hook) because it has no side effects
 * and doesn't call any React hooks. It's extracted here so both
 * handleNewGame and the initial useState call can reuse it.
 */
function buildInitialState(difficulty: Difficulty): GameState {
  return {
    cards: generateCards(difficulty),
    moves: 0,
    matches: 0,
    isComplete: false,
    startTime: null,
    elapsedTime: 0,
  };
}
