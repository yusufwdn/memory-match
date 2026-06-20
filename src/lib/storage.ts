/**
 * storage provides safe wrappers around browser Local Storage.
 *
 * Local Storage can fail (private browsing mode, storage quota exceeded,
 * SSR environments). Wrapping it here means the rest of the app
 * never needs to worry about try/catch blocks around storage calls.
 *
 * Phase 9 will implement:
 *   - getBestScores(): reads saved best scores from Local Storage
 *   - saveBestScore(score): saves a score if it beats the current best
 *   - getLastDifficulty(): remembers the last difficulty the player used
 *   - saveLastDifficulty(difficulty): persists the chosen difficulty
 */
