import { STORAGE_KEYS } from "@/constants/game";
import type { BestScores, Difficulty, GameScore } from "@/types/game";

// ─────────────────────────────────────────────────────────────────────────────
// SAFE LOCAL STORAGE ACCESS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if localStorage is accessible in this environment.
 *
 * localStorage is not available during Next.js server-side rendering
 * because the server has no browser APIs. This guard prevents crashes
 * when the module is evaluated on the server.
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // A quick write/delete verifies storage isn't blocked (e.g. private mode)
    localStorage.setItem("__storage_test__", "1");
    localStorage.removeItem("__storage_test__");
    return true;
  } catch {
    return false;
  }
}

function readJSON<T>(key: string): T | null {
  if (!isStorageAvailable()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // JSON.parse can throw if the stored value is corrupted
    return null;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // setItem can throw when storage quota is exceeded — silently ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BEST SCORES
// ─────────────────────────────────────────────────────────────────────────────

/** Loads all saved best scores from Local Storage. Returns an empty object if none exist. */
export function getBestScores(): BestScores {
  return readJSON<BestScores>(STORAGE_KEYS.bestScores) ?? {};
}

/**
 * Saves a completed game as the new best if it beats the current record.
 *
 * "Better" is defined as a higher score. Returns true if the record
 * was beaten (so the UI can show a "New Best!" indicator).
 */
export function saveBestScoreIfBeaten(
  difficulty: Difficulty,
  score: number,
  moves: number,
  timeSeconds: number
): boolean {
  const current = getBestScores();
  const existing = current[difficulty];

  // Only update if this run beats the saved record (or no record exists yet)
  if (existing && existing.score >= score) return false;

  const updated: BestScores = {
    ...current,
    [difficulty]: {
      score,
      moves,
      timeSeconds,
      difficulty,
      completedAt: new Date().toISOString(),
    } satisfies GameScore,
  };

  writeJSON(STORAGE_KEYS.bestScores, updated);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// LAST DIFFICULTY
// ─────────────────────────────────────────────────────────────────────────────

/** Reads the last difficulty the player used. Returns null if never saved. */
export function getLastDifficulty(): Difficulty | null {
  return readJSON<Difficulty>(STORAGE_KEYS.lastDifficulty);
}

/** Persists the chosen difficulty so the next session starts on the same level. */
export function saveLastDifficulty(difficulty: Difficulty): void {
  writeJSON(STORAGE_KEYS.lastDifficulty, difficulty);
}
