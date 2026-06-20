"use client";

import { motion } from "framer-motion";
import type { Difficulty, DifficultyConfig } from "@/types/game";
import { DIFFICULTY_CONFIG } from "@/constants/game";

type DifficultyModalProps = {
  current: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
};

/**
 * A brief descriptor shown under each difficulty card.
 * Lives here rather than in constants because it is display-only copy,
 * not configuration data used by game logic.
 */
const DESCRIPTIONS: Record<Difficulty, string> = {
  easy:   "6 pairs · 4 × 3 grid",
  medium: "8 pairs · 4 × 4 grid",
  hard:   "12 pairs · 6 × 4 grid",
};

/**
 * DifficultyModal presents three clickable option cards.
 * Clicking any one immediately starts a new game at that difficulty.
 * Pressing the backdrop or the ✕ button cancels without changing anything.
 */
export default function DifficultyModal({
  current,
  onSelect,
  onClose,
}: DifficultyModalProps) {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    // Backdrop — clicking it dismisses the modal
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Modal card — stopPropagation prevents backdrop click from firing */}
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.05 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-white">Choose Difficulty</h2>
          <button
            onClick={onClose}
            aria-label="Close difficulty selector"
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Difficulty options */}
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((d) => {
            const config: DifficultyConfig = DIFFICULTY_CONFIG[d];
            const isActive = d === current;

            return (
              <button
                key={d}
                onClick={() => onSelect(d)}
                aria-pressed={isActive}
                className={`
                  rounded-2xl p-4 text-center transition-all duration-150
                  flex flex-col items-center gap-2
                  ${isActive
                    ? "bg-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-750"
                  }
                `}
              >
                <span className="text-lg font-extrabold">{config.label}</span>
                <span className="text-xs opacity-75 leading-tight">
                  {DESCRIPTIONS[d]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-5">
          Click a difficulty to start immediately
        </p>

      </motion.div>
    </motion.div>
  );
}
