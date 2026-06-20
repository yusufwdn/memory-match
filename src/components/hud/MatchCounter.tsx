"use client";

/**
 * MatchCounter shows how many pairs have been matched.
 *
 * It also shows the total pairs available so the player
 * can see their progress: e.g. "3 / 8 pairs".
 */
export default function MatchCounter() {
  // Phase 5: will receive matches: number and totalPairs: number as props.
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Matches</p>
      <p className="text-2xl font-bold text-white">0</p>
    </div>
  );
}
