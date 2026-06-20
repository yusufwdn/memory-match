import type { Difficulty, DifficultyConfig } from "@/types/game";

// ─────────────────────────────────────────────────────────────────────────────
// SYMBOLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The pool of symbols used to generate card pairs.
 *
 * The game picks from this list based on how many pairs are needed.
 * Hard mode (24 cards = 12 pairs) needs 12 symbols; easy mode needs 6.
 *
 * Using emojis keeps the game visual without needing image assets.
 */
export const CARD_SYMBOLS: string[] = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊",
  "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
  "🐸", "🐵", "🐔", "🐧", "🐦", "🦆",
  "🦅", "🦉", "🦇", "🐺", "🐗", "🐴",
];

// ─────────────────────────────────────────────────────────────────────────────
// DIFFICULTY CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defines the grid size and card count for each difficulty.
 *
 * totalCards must always be even (pairs of 2).
 * The grid must fit neatly: cols × rows === totalCards.
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy:   { label: "Easy",   cols: 4, rows: 3, totalCards: 12 },
  medium: { label: "Medium", cols: 4, rows: 4, totalCards: 16 },
  hard:   { label: "Hard",   cols: 6, rows: 4, totalCards: 24 },
};

// ─────────────────────────────────────────────────────────────────────────────
// TIMING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How long (in milliseconds) two unmatched flipped cards stay visible
 * before flipping back face-down.
 *
 * 1000ms (1 second) gives the player just enough time to see both
 * symbols without making it trivially easy to memorise them.
 */
export const FLIP_BACK_DELAY_MS = 1000;

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Keys used to read/write data in the browser's Local Storage.
 *
 * Centralising them here prevents typos like "bestScore" vs "best_score"
 * scattered across multiple files.
 */
export const STORAGE_KEYS = {
  bestScores: "memory-match:best-scores",
  lastDifficulty: "memory-match:last-difficulty",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base score awarded for completing a game.
 * Bonuses for speed and low move count are added on top.
 */
export const BASE_SCORE = 1000;
