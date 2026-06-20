import { useState, useCallback, useRef } from "react";
import { generateCards } from "@/lib/cardUtils";
import { checkMatch, isGameComplete, calculateScore } from "@/lib/gameLogic";
import { useTimer } from "@/hooks/useTimer";
import { FLIP_BACK_DELAY_MS, DIFFICULTY_CONFIG } from "@/constants/game";
import type { Difficulty, GameState } from "@/types/game";

export function useGameState() {
  // ─── Core state ────────────────────────────────────────────────────────────

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState>(() =>
    buildInitialState("easy")
  );

  /**
   * Tracks the IDs of the cards currently face-up but not yet resolved.
   * Can hold 0, 1, or 2 IDs. When it holds 2, the board is locked.
   *
   * This lives outside GameState intentionally — it is internal flip
   * logic, not part of the persisted game record (score, moves, etc.).
   */
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);

  /**
   * Stores the timeout ID for the flip-back delay.
   *
   * useRef is used instead of useState because changing this value
   * should NOT trigger a re-render — it's just a handle we need
   * so we can cancel the timeout if the player starts a new game
   * before the delay finishes.
   */
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function clearFlipTimeout() {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
  }

  // ─── Flip card ─────────────────────────────────────────────────────────────

  const handleFlipCard = useCallback(
    (cardId: string) => {
      // Board is locked while two unmatched cards are visible.
      // Prevents the player from flipping a third card mid-evaluation.
      if (flippedCardIds.length === 2) return;

      // Validate the clicked card against the current state.
      // We read from gameState.cards here so we can use the result
      // both inside setGameState and in the flip-back timeout below.
      const card = gameState.cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || card.isFlipped) return;

      const isSecondFlip = flippedCardIds.length === 1;

      // Compute the match check now, synchronously, using current state.
      // We do it here (outside setGameState) so the result is available
      // for both the state update AND the timeout scheduling below.
      let isMatch = false;
      if (isSecondFlip) {
        const firstCard = gameState.cards.find((c) => c.id === flippedCardIds[0])!;
        isMatch = checkMatch(firstCard, card);
      }

      // ── Update game state ─────────────────────────────────────────────────

      setGameState((prev) => {
        // Flip the clicked card face-up
        const withFlipped = prev.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        );

        // Start the timer on the very first card flip of the game.
        // null means "not started yet"; we set it once and never overwrite.
        const startTime = prev.startTime ?? Date.now();

        // First flip — just reveal the card and start the clock
        if (!isSecondFlip) {
          return { ...prev, cards: withFlipped, startTime };
        }

        // Second flip — match confirmed
        if (isMatch) {
          const withMatched = withFlipped.map((c) =>
            c.id === cardId || c.id === flippedCardIds[0]
              ? { ...c, isFlipped: false, isMatched: true }
              : c
          );
          const newMoves = prev.moves + 1;
          const newMatches = prev.matches + 1;
          const complete = isGameComplete(withMatched);
          const totalPairs = DIFFICULTY_CONFIG[difficulty].totalCards / 2;

          return {
            ...prev,
            startTime,
            cards: withMatched,
            moves: newMoves,
            matches: newMatches,
            isComplete: complete,
            // Score is calculated in the same update so no intermediate
            // state exists where isComplete is true but score is null.
            score: complete
              ? calculateScore(newMoves, prev.elapsedTime, difficulty, totalPairs)
              : null,
          };
        }

        // Second flip — no match (flip-back is scheduled below)
        return {
          ...prev,
          startTime,
          cards: withFlipped,
          moves: prev.moves + 1,
        };
      });

      // ── Update flippedCardIds and schedule flip-back ───────────────────────

      if (!isSecondFlip) {
        setFlippedCardIds([cardId]);
        return;
      }

      if (isMatch) {
        // Cards are matched — clear the tracking list immediately
        setFlippedCardIds([]);
      } else {
        // No match — schedule the flip-back after the delay
        clearFlipTimeout();
        const firstId = flippedCardIds[0];

        flipTimeoutRef.current = setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            cards: prev.cards.map((c) =>
              c.id === firstId || c.id === cardId
                ? { ...c, isFlipped: false }
                : c
            ),
          }));
          setFlippedCardIds([]);
        }, FLIP_BACK_DELAY_MS);
      }
    },
    [flippedCardIds, gameState.cards]
  );

  // ─── New game / Restart ────────────────────────────────────────────────────

  const handleNewGame = useCallback(
    (newDifficulty?: Difficulty) => {
      // Cancel any pending flip-back before resetting the board.
      // Without this, the timeout could fire after the reset and corrupt
      // the new game's state.
      clearFlipTimeout();
      const activeDifficulty = newDifficulty ?? difficulty;
      setDifficulty(activeDifficulty);
      setGameState(buildInitialState(activeDifficulty));
      setFlippedCardIds([]);
    },
    [difficulty]
  );

  const handleRestart = useCallback(() => {
    clearFlipTimeout();
    setGameState(buildInitialState(difficulty));
    setFlippedCardIds([]);
  }, [difficulty]);

  // ─── Timer ─────────────────────────────────────────────────────────────────

  // Starts ticking when startTime is set, stops when isComplete is true.
  // Writes elapsedTime back into gameState every second via setGameState.
  useTimer(gameState.startTime, gameState.isComplete, setGameState);

  // ─── Return ────────────────────────────────────────────────────────────────

  // isLocked is derived — not stored — because it can always be computed
  // from flippedCardIds. Storing it separately would require manual sync.
  const isLocked = flippedCardIds.length === 2;

  return {
    gameState,
    difficulty,
    isLocked,
    handleFlipCard,
    handleNewGame,
    handleRestart,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function buildInitialState(difficulty: Difficulty): GameState {
  return {
    cards: generateCards(difficulty),
    moves: 0,
    matches: 0,
    isComplete: false,
    startTime: null,
    elapsedTime: 0,
    score: null,
  };
}
