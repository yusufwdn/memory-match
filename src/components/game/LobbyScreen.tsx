"use client";

import { useState, useEffect } from "react";
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

const DIFFICULTY_DETAIL: Record<
  Difficulty,
  { borderColor: string; color: string; description: string; shadowColor: string }
> = {
  easy:   { color: "bg-green-600",  borderColor: "border-green-400",  description: "6 pairs · 4 × 3",  shadowColor: "shadow-green-600/30" },
  medium: { color: "bg-yellow-600", borderColor: "border-yellow-400", description: "8 pairs · 4 × 4",  shadowColor: "shadow-yellow-600/30" },
  hard:   { color: "bg-red-600",    borderColor: "border-red-400",    description: "12 pairs · 6 × 4", shadowColor: "shadow-red-600/30" },
};

// ─── Flip preview ──────────────────────────────────────────────────────────────

// Symbols shown in the flip preview row above the title
const PREVIEW_SYMBOLS = ["🐶", "🐱", "🐻", "🐰"];

/**
 * Four face-down cards that flip one at a time in a loop, hinting at the
 * gameplay mechanic. Uses setTimeout cycling so the stagger persists on repeat.
 * The component is purely decorative — aria-hidden from screen readers.
 */
function FlipPreview() {
  // Which card is currently face-up. null means all are face-down.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let current = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function cycle() {
      setActiveIndex(current);

      // Flip back after 1 second
      const t1 = setTimeout(() => {
        setActiveIndex(null);

        // Short pause, then advance to the next card
        const t2 = setTimeout(() => {
          current = (current + 1) % PREVIEW_SYMBOLS.length;
          cycle();
        }, 350);
        timers.push(t2);
      }, 1000);
      timers.push(t1);
    }

    // Small initial delay before starting so the lobby entrance finishes first
    const t0 = setTimeout(cycle, 700);
    timers.push(t0);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex gap-3" aria-hidden="true">
      {PREVIEW_SYMBOLS.map((symbol, i) => {
        const isFlipped = activeIndex === i;

        return (
          <div key={i} style={{ perspective: "600px", width: 48, height: 48 }}>
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back face */}
              <div
                className="absolute inset-0 rounded-xl bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-lg"
                style={{ backfaceVisibility: "hidden" }}
              >
                ?
              </div>
              {/* Front face */}
              <div
                className="absolute inset-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {symbol}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Floating background cards ──────────────────────────────────────────────

type FloatingCardConfig = {
  left: string;
  top: string;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
};

// Fixed positions for 8 decorative cards scattered around the viewport.
// Using fixed values (no Math.random) keeps this SSR-safe.
const FLOATING_CARDS: FloatingCardConfig[] = [
  { left: "6%",  top: "10%", size: 56, rotate: -18, duration: 6.0, delay: 0.0 },
  { left: "83%", top: "7%",  size: 44, rotate:  22, duration: 7.2, delay: 0.8 },
  { left: "2%",  top: "52%", size: 52, rotate: -10, duration: 5.5, delay: 1.6 },
  { left: "87%", top: "45%", size: 48, rotate:  28, duration: 8.0, delay: 0.4 },
  { left: "11%", top: "79%", size: 40, rotate:  13, duration: 6.8, delay: 2.0 },
  { left: "79%", top: "73%", size: 58, rotate: -22, duration: 7.5, delay: 1.2 },
  { left: "46%", top: "3%",  size: 36, rotate:   6, duration: 5.8, delay: 2.8 },
  { left: "54%", top: "89%", size: 46, rotate: -14, duration: 9.0, delay: 0.6 },
];

/**
 * A single semi-transparent floating "?" card that bobs up and down gently.
 * pointer-events-none so it never interferes with clicks.
 */
function FloatingCard({ left, top, size, rotate, duration, delay }: FloatingCardConfig) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left, top, width: size, height: size }}
      animate={{ y: [0, -14, 0], rotate: [rotate, rotate + 3, rotate] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-full h-full rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-600"
        style={{ opacity: 0.28, fontSize: size * 0.36 }}
      >
        ?
      </div>
    </motion.div>
  );
}

// ─── LobbyScreen ───────────────────────────────────────────────────────────────

/**
 * LobbyScreen is the entry point shown before any game starts and whenever
 * the player clicks "New Game" during play.
 *
 * Two animation layers sit behind the main content:
 *  1. Floating background cards — 8 semi-transparent cards drifting slowly
 *  2. Flip preview row — 4 mini cards that flip one by one in a loop
 *
 * The player picks a difficulty, then clicks Start Game.
 * No game state is touched until Start is pressed.
 */
export default function LobbyScreen({
  initialDifficulty,
  bestScores,
  onStart,
}: LobbyScreenProps) {
  const [selected, setSelected] = useState<Difficulty>(initialDifficulty);
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <motion.div
      // This wrapper covers the full viewport so background cards can spread out.
      // The exit opacity animation propagates to fixed children, hiding them cleanly.
      className="fixed inset-0 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >

      {/* ── Background floating cards ──────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_CARDS.map((card, i) => (
          <FloatingCard key={i} {...card} />
        ))}
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md"
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        exit={{ y: -16 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.05 }}
      >

        {/* Flip preview — above the title */}
        <FlipPreview />

        {/* Title */}
        <div className="text-center -mt-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Memory Match
          </h1>
          <p className="text-sm text-gray-500 mt-2">Find all matching pairs</p>
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
                      ? `${DIFFICULTY_DETAIL[d].color} border-2 ${DIFFICULTY_DETAIL[d].borderColor} text-white shadow-lg ${DIFFICULTY_DETAIL[d].shadowColor} scale-105`
                      : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-gray-500"
                    }
                  `}
                >
                  <span className="text-base font-extrabold">{config.label}</span>
                  <span className="text-xs leading-tight">
                    {DIFFICULTY_DETAIL[d].description}
                  </span>
                  {best && (
                    <span className={`text-xs font-semibold mt-1 ${isSelected ? "text-white" : "text-gray-400"}`}>
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
    </motion.div>
  );
}
