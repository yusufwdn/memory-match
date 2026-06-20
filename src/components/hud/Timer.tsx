"use client";

/**
 * Timer displays the elapsed time since the first card was flipped.
 *
 * The timer starts on the first flip (not when the page loads)
 * so the player has time to study the board before the clock begins.
 *
 * Format: MM:SS (e.g. "01:45")
 */
export default function Timer() {
  // Phase 7: will receive elapsedTime: number (seconds) as a prop.
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
      <p className="text-2xl font-bold text-white font-mono">00:00</p>
    </div>
  );
}
