"use client";

/**
 * MoveCounter displays how many moves the player has made.
 *
 * A "move" is counted each time the player flips a second card,
 * regardless of whether it matched or not.
 */
export default function MoveCounter() {
  // Phase 5: will receive moves: number as a prop.
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Moves</p>
      <p className="text-2xl font-bold text-white">0</p>
    </div>
  );
}
