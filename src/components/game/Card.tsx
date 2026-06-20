"use client";

import type { Card } from "@/types/game";

type CardSize = "md" | "sm";

type CardProps = {
  card: Card;
  size?: CardSize;
  onClick: () => void;
};

/**
 * Size classes defined as literals so Tailwind includes them in the bundle.
 * "md" is the default (easy/medium). "sm" is used in hard mode (6 columns).
 */
const SIZE_CLASSES: Record<CardSize, string> = {
  md: "w-16 h-16 text-2xl",
  sm: "w-12 h-12 text-xl",
};

/**
 * Card renders a single card on the board.
 *
 * Visual states:
 *   face-down  → dark gray,  shows "?"
 *   face-up    → indigo,     shows symbol
 *   matched    → green,      shows symbol, disabled
 *
 * Phase 10 will add a Framer Motion 3D flip animation between states.
 */
export default function Card({ card, size = "md", onClick }: CardProps) {
  const { symbol, isFlipped, isMatched } = card;
  const isVisible = isFlipped || isMatched;

  return (
    <button
      onClick={onClick}
      disabled={isMatched}
      className={`
        ${SIZE_CLASSES[size]}
        rounded-xl font-bold
        flex items-center justify-center
        transition-colors duration-150
        select-none
        ${isMatched
          ? "bg-green-800 cursor-default text-green-200"
          : isFlipped
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-gray-700 hover:bg-gray-600 text-gray-400 cursor-pointer"
        }
      `}
    >
      {isVisible ? symbol : "?"}
    </button>
  );
}
