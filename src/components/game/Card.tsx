"use client";

import type { Card } from "@/types/game";

type CardSize = "md" | "sm";

type CardProps = {
  card: Card;
  size?: CardSize;
  /** True while two unmatched cards are showing. Dims unflipped cards. */
  isLocked?: boolean;
  onClick: () => void;
};

const SIZE_CLASSES: Record<CardSize, string> = {
  md: "w-16 h-16 text-2xl",
  sm: "w-12 h-12 text-xl",
};

/**
 * Card has four distinct visual states:
 *
 *  1. face-down, board open   → dark gray, hoverable
 *  2. face-down, board locked → dimmed, not-allowed cursor
 *  3. face-up (being evaluated) → indigo, no hover effect
 *  4. matched                 → green, disabled
 *
 * State 2 is the new addition in Phase 5.
 * It tells the player "wait — I'm evaluating those two cards."
 */
export default function Card({ card, size = "md", isLocked = false, onClick }: CardProps) {
  const { symbol, isFlipped, isMatched } = card;
  const isVisible = isFlipped || isMatched;

  // A card is interactable only when the board is open AND it hasn't been
  // matched yet AND it isn't already face-up.
  const isInteractable = !isMatched && !isFlipped && !isLocked;

  return (
    <button
      onClick={onClick}
      disabled={!isInteractable}
      className={`
        ${SIZE_CLASSES[size]}
        rounded-xl font-bold
        flex items-center justify-center
        transition-all duration-150
        select-none
        ${isMatched
          ? "bg-green-800 cursor-default text-green-200 opacity-80"
          : isFlipped
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : isLocked
              ? "bg-gray-700 text-gray-600 opacity-40 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-600 hover:scale-105 text-gray-400 cursor-pointer"
        }
      `}
    >
      {isVisible ? symbol : "?"}
    </button>
  );
}
