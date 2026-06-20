"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { GameScore } from "@/types/game";

type GameCompleteProps = {
  moves: number;
  elapsedTime: number; // seconds
  totalPairs: number;
  score: number;
  difficultyLabel: string;
  /** The previous best score for this difficulty, or undefined if none exists. */
  previousBest: GameScore | undefined;
  /** True if the player just set a new personal best on this difficulty. */
  isNewBest: boolean;
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
  previousBest,
  isNewBest,
  onPlayAgain,
  onNewGame,
}: GameCompleteProps) {
  return (
    // Backdrop: fixed overlay covering the whole viewport
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >

      {/* Modal card — slides up and fades in */}
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
      >

        {/* Trophy */}
        <div className="text-6xl mb-4">🏆</div>

        <h2 className="text-2xl font-extrabold text-white mb-1">
          You Won!
        </h2>
        <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest">
          {difficultyLabel} Mode
        </p>

        {/* Score — the headline number */}
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl py-4 mb-3 relative">
          {/* New best badge — only shown when the player set a new record */}
          {isNewBest && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
              New Best!
            </span>
          )}
          <p className="text-4xl font-extrabold text-indigo-300 tabular-nums">
            {score.toLocaleString()}
          </p>
          <p className="text-xs text-indigo-400 mt-1 uppercase tracking-widest">Score</p>
        </div>

        {/* Previous best — shown only when there IS a saved record and it wasn't just beaten */}
        {previousBest && !isNewBest && (
          <p className="text-xs text-gray-500 mb-4">
            Best: {previousBest.score.toLocaleString()}
          </p>
        )}

        {/* Spacer when no previous-best line is shown */}
        {(!previousBest || isNewBest) && <div className="mb-4" />}

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

      </motion.div>
    </motion.div>
  );
}
