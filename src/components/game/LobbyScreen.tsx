"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Difficulty, GameScore } from "@/types/game";
import { DIFFICULTY_CONFIG } from "@/constants/game";

type LobbyScreenProps = {
  /** Pre-selects the difficulty from the player's last session. */
  initialDifficulty: Difficulty;
  /** Best scores per difficulty — displayed on each option card. */
  bestScores: Record<string, GameScore>;
  /** Called when the player confirms a difficulty and clicks Start Game. */
  onStart: (difficulty: Difficulty) => void;
};

/**
 * Short descriptors shown on each difficulty card.
 * Display copy lives here, not in constants — it is not used by game logic.
 */
const DIFFICULTY_DETAIL: Record<Difficulty, string> = {
  easy:   "6 pairs · 4 × 3",
  medium: "8 pairs · 4 × 4",
  hard:   "12 pairs · 6 × 4",
};

/**
 * LobbyScreen is the entry point shown before any game starts and whenever
 * the player clicks "New Game" during play.
 *
 * The player picks a difficulty (one is always pre-selected from their last
 * session), then clicks Start Game. No game state is touched until Start is
 * pressed.
 */
export default function LobbyScreen({
  initialDifficulty,
  bestScores,
  onStart,
}: LobbyScreenProps) {
  // Local selection state — not committed to the game until Start is clicked.
  const [selected, setSelected] = useState<Difficulty>(initialDifficulty);

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <motion.div
      className="flex flex-col items-center gap-8 w-full max-w-md"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >

      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Memory Match
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Find all matching pairs
        </p>
      </div>

      {/* Difficulty selector */}
      <div className="w-full">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 text-center">
          Choose difficulty
        </p>

        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((d) => {
            const config = DIFFICULTY_CONFIG[d];
            const best = bestScores[d];
            const isSelected = d === selected;

            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                aria-pressed={isSelected}
                className={`
                  rounded-2xl p-4 text-center
                  flex flex-col items-center gap-1
                  transition-all duration-150
                  ${isSelected
                    ? "bg-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-750"
                  }
                `}
              >
                <span className="text-base font-extrabold">{config.label}</span>
                <span className="text-xs opacity-70 leading-tight">
                  {DIFFICULTY_DETAIL[d]}
                </span>
                {/* Best score for this difficulty — shown once a record exists */}
                {best && (
                  <span className={`text-xs font-semibold mt-1 ${isSelected ? "text-indigo-200" : "text-indigo-400"}`}>
                    Best: {best.score.toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <Button
        variant="primary"
        className="w-full py-3 text-base font-bold"
        onClick={() => onStart(selected)}
      >
        Start Game
      </Button>

    </motion.div>
  );
}
