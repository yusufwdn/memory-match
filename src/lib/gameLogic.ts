import {
  BASE_SCORE,
  MOVE_PENALTY,
  TIME_PENALTY,
  DIFFICULTY_MULTIPLIER,
} from "@/constants/game";
import type { Card, Difficulty } from "@/types/game";

/**
 * Returns true if two cards share the same symbol.
 *
 * This is intentionally a pure function — it only looks at what it
 * receives and returns a result with no side effects. Pure functions
 * are trivial to test and reason about.
 */
export function checkMatch(cardA: Card, cardB: Card): boolean {
  return cardA.symbol === cardB.symbol;
}

/**
 * Returns true when every card on the board has been matched.
 * Used to detect game completion after each successful match.
 */
export function isGameComplete(cards: Card[]): boolean {
  return cards.every((card) => card.isMatched);
}

/**
 * Calculates the final score for a completed game.
 *
 * Formula:
 *   score = BASE_SCORE × multiplier − extraMoves × MOVE_PENALTY − time × TIME_PENALTY
 *
 * extraMoves = moves − totalPairs
 *   (totalPairs is the theoretical minimum — one successful match per attempt)
 *
 * Score is clamped to 0 so it never goes negative.
 */
export function calculateScore(
  moves: number,
  elapsedTime: number,
  difficulty: Difficulty,
  totalPairs: number
): number {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];
  const extraMoves = Math.max(0, moves - totalPairs);

  const raw =
    BASE_SCORE * multiplier
    - extraMoves * MOVE_PENALTY
    - elapsedTime * TIME_PENALTY;

  return Math.max(0, Math.round(raw));
}
