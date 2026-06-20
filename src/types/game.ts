// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a single card on the game board.
 *
 * Each symbol appears exactly twice in the deck so the player
 * must find both to make a match.
 */
export type Card = {
  /** Unique identifier — used by React as the "key" prop to track each card. */
  id: string;

  /** The emoji or icon shown when the card is face-up. */
  symbol: string;

  /** True while the card is face-up but not yet confirmed as a match. */
  isFlipped: boolean;

  /**
   * True once the card's pair has been found.
   * Matched cards stay face-up and cannot be flipped again.
   */
  isMatched: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The complete state of one game session.
 *
 * This is the single source of truth for everything that changes
 * during gameplay. All components read from this; nothing is stored
 * anywhere else.
 */
export type GameState = {
  /** All cards currently on the board (both face-down and matched). */
  cards: Card[];

  /**
   * How many times the player has flipped a pair.
   * A "move" counts when the second card is flipped (not after every single flip).
   */
  moves: number;

  /** How many pairs have been successfully matched so far. */
  matches: number;

  /** True when every pair on the board has been matched. */
  isComplete: boolean;

  /**
   * Unix timestamp (ms) when the game started.
   * Null means the game has not started yet (before first flip).
   */
  startTime: number | null;

  /** Total elapsed seconds. Updated every second by the timer. */
  elapsedTime: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// DIFFICULTY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The available difficulty settings.
 *
 * Using a union of string literals instead of a plain string means
 * TypeScript will warn you if you mistype "Meduim" — the exact strings
 * are enforced everywhere.
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * The configuration for each difficulty level.
 * Stored in constants/game.ts and used to build the board.
 */
export type DifficultyConfig = {
  label: string;
  /** Number of columns in the grid. */
  cols: number;
  /** Number of rows in the grid. */
  rows: number;
  /** Total number of cards (cols × rows). Always an even number. */
  totalCards: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A completed game result saved to Local Storage.
 *
 * We save the difficulty so best scores can be compared
 * within the same difficulty level only.
 */
export type GameScore = {
  moves: number;
  timeSeconds: number;
  difficulty: Difficulty;
  /** ISO date string — when this game was completed. */
  completedAt: string;
};

/**
 * The best score per difficulty level.
 * Stored in Local Storage and updated whenever a player beats their record.
 */
export type BestScores = {
  [key in Difficulty]?: GameScore;
};
