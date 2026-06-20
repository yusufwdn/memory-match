"use client";

import Button from "@/components/ui/Button";

type GameCompleteProps = {
  moves: number;
  elapsedTime: number; // seconds
  totalPairs: number;
  score: number;
  difficultyLabel: string;
  onPlayAgain: () => void;
  onNewGame: () => void;
};

/**
 * Formats seconds into a readable string: "1m 23s" or "45s".
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

/**
 * GameComplete renders a full-screen modal overlay when the player
 * finds all pairs.
 *
 * It uses a fixed-position backdrop (covers the whole viewport) with
 * a centered card on top. The backdrop is semi-transparent so the
 * completed board is still visible behind it.
 *
 * Props are all passed in — this component owns no state.
 * It just displays what it receives and calls callbacks on button clicks.
 */
export default function GameComplete({
  moves,
  elapsedTime,
  totalPairs,
  score,
  difficultyLabel,
  onPlayAgain,
  onNewGame,
}: GameCompleteProps) {
  return (
    // Backdrop: fixed overlay covering the whole viewport
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      {/* Modal card */}
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">

        {/* Trophy */}
        <div className="text-6xl mb-4">🏆</div>

        <h2 className="text-2xl font-extrabold text-white mb-1">
          You Won!
        </h2>
        <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest">
          {difficultyLabel} Mode
        </p>

        {/* Score — the headline number */}
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl py-4 mb-6">
          <p className="text-4xl font-extrabold text-indigo-300 tabular-nums">
            {score.toLocaleString()}
          </p>
          <p className="text-xs text-indigo-400 mt-1 uppercase tracking-widest">Score</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-2xl py-4">
            <p className="text-2xl font-bold text-white">{moves}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Moves</p>
          </div>
          <div className="bg-gray-800 rounded-2xl py-4">
            <p className="text-2xl font-bold text-white">{formatDuration(elapsedTime)}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Time</p>
          </div>
          <div className="bg-gray-800 rounded-2xl py-4">
            <p className="text-2xl font-bold text-white">{totalPairs}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Pairs</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" className="w-full py-3" onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="secondary" className="w-full py-3" onClick={onNewGame}>
            New Game
          </Button>
        </div>

      </div>
    </div>
  );
}
