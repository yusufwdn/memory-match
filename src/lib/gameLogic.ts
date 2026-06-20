import type { Card } from "@/types/game";

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
