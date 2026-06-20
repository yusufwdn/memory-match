"use client";

import type { Card } from "@/types/game";

type CardProps = {
  card: Card;
  onClick: () => void;
};

/**
 * Card renders a single card on the board.
 *
 * Visual states:
 *   - Face-down (default): shows a question mark, dark background
 *   - Face-up (isFlipped): shows the symbol, lighter background
 *   - Matched (isMatched): shows the symbol, green tint — permanently visible
 *
 * Phase 10 will replace this with a Framer Motion 3D flip animation.
 * For now the state change is instant (no transition).
 */
export default function Card({ card, onClick }: CardProps) {
  const { symbol, isFlipped, isMatched } = card;

  // A matched card cannot be clicked again.
  const isVisible = isFlipped || isMatched;

  return (
    <button
      onClick={onClick}
      disabled={isMatched}
      className={`
        w-16 h-16 rounded-xl text-2xl font-bold
        flex items-center justify-center
        transition-colors duration-150
        ${isMatched
          ? "bg-green-800 cursor-default"
          : isFlipped
            ? "bg-indigo-700"
            : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
        }
      `}
    >
      {isVisible ? symbol : "?"}
    </button>
  );
}
