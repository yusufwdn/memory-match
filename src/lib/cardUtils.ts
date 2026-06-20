import { CARD_SYMBOLS, DIFFICULTY_CONFIG } from "@/constants/game";
import type { Card, Difficulty } from "@/types/game";

/**
 * Randomly shuffles an array using the Fisher-Yates algorithm.
 *
 * Why Fisher-Yates and not array.sort(() => Math.random() - 0.5)?
 * The sort-based approach is biased — some orderings are more likely
 * than others because sort() was not designed for randomness.
 * Fisher-Yates walks the array from the end, swapping each element
 * with a randomly chosen earlier element. Every permutation has
 * an exactly equal chance of being produced.
 *
 * The function accepts a generic <T> so it works with any array type,
 * not just Card arrays.
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Copy the array so we don't mutate the original.
  // "Mutating" means changing the original — a bad habit in React
  // because React relies on detecting changes to know when to re-render.
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 up to and including i.
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap shuffled[i] with shuffled[randomIndex].
    // This ES6 destructuring syntax swaps two values in one line.
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

/**
 * Generates a full shuffled deck of cards for the given difficulty.
 *
 * Steps:
 *   1. Look up how many cards the difficulty needs (e.g. easy = 12)
 *   2. Pick that many symbols from the symbol pool (12 cards = 6 symbols)
 *   3. Duplicate each symbol to create a pair
 *   4. Shuffle the pairs into a random order
 *   5. Map each symbol to a Card object with a unique ID
 */
export function generateCards(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const pairsNeeded = config.totalCards / 2;

  // Take only as many symbols as we need for this difficulty.
  // Slice does not mutate the original array — it returns a new one.
  const selectedSymbols = CARD_SYMBOLS.slice(0, pairsNeeded);

  // Duplicate each symbol so every symbol appears exactly twice.
  // This ensures every card has exactly one matching partner.
  const symbolPairs = [...selectedSymbols, ...selectedSymbols];

  // Shuffle the pairs so matching cards aren't adjacent on the board.
  const shuffledSymbols = shuffleArray(symbolPairs);

  // Convert each symbol string into a full Card object.
  return shuffledSymbols.map((symbol, index) => ({
    // The ID combines the symbol and its position index.
    // Using index ensures two cards with the same symbol still have unique IDs.
    id: `${symbol}-${index}`,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}
