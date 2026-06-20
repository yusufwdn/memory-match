"use client";

/**
 * GameControls renders the New Game and Restart buttons.
 *
 * - New Game: resets everything and picks a new set of cards
 * - Restart: replays the same card layout (same symbols, reshuffled)
 *
 * Both buttons call handlers from useGameState.
 */
export default function GameControls() {
  // Phase 2: will receive onNewGame and onRestart as props.
  return (
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
        New Game
      </button>
      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm">
        Restart
      </button>
    </div>
  );
}
