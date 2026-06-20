"use client";

import { motion } from "framer-motion";
import type { Card } from "@/types/game";

type CardSize = "md" | "sm";

type CardProps = {
  card: Card;
  size?: CardSize;
  /** True while two unmatched cards are showing. Dims unflipped cards. */
  isLocked?: boolean;
  /** Position in the grid — used for the aria-label only. */
  index: number;
  onClick: () => void;
};

// Physical dimensions of each card size
const SIZE_CLASSES: Record<CardSize, string> = {
  md: "w-16 h-16 text-2xl",
  sm: "w-12 h-12 text-xl",
};

/**
 * The 3D flip illusion works by rotating a container 180° on the Y axis.
 * Both faces (back and front) are inside the container with `backfaceVisibility: hidden`.
 * The front face starts pre-rotated 180° so it is hidden until the container
 * itself rotates 180°, at which point the combined rotation equals 360° and
 * the front face appears facing the player.
 *
 * The matched "pop" uses a quick scale + opacity spring to draw the eye
 * without being distracting.
 */
export default function Card({
  card,
  size = "md",
  isLocked = false,
  index,
  onClick,
}: CardProps) {
  const { symbol, isFlipped, isMatched } = card;

  // A card is interactable only when the board is open AND it hasn't been
  // matched yet AND it isn't already face-up.
  const isInteractable = !isMatched && !isFlipped && !isLocked;

  // Rotation angle drives the entire flip illusion.
  // 0° = face-down (showing back), 180° = face-up (showing symbol).
  const rotateY = isFlipped || isMatched ? 180 : 0;

  // Describe the card's current state for screen readers.
  const ariaLabel = isMatched
    ? `Card ${index + 1}: ${symbol}, matched`
    : isFlipped
      ? `Card ${index + 1}: ${symbol}, face up`
      : `Card ${index + 1}: face down`;

  return (
    // Outer wrapper: provides the 3D perspective.
    // perspective must be set on the parent of the element that transforms.
    // A value of 800–1200px gives a natural, not-too-extreme depth effect.
    <div
      className={`${SIZE_CLASSES[size]} cursor-pointer`}
      style={{ perspective: "1000px" }}
      onClick={isInteractable ? onClick : undefined}
    >
      {/* Container: the element that actually rotates.
          transformStyle: "preserve-3d" tells the browser that child elements
          exist in 3D space relative to this container, not flattened into 2D. */}
      <motion.div
        role="button"
        aria-label={ariaLabel}
        aria-disabled={!isInteractable}
        tabIndex={isInteractable ? 0 : -1}
        onKeyDown={(e) => {
          // Allow keyboard players to flip cards with Enter or Space
          if (isInteractable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        className="relative w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-xl"
        animate={{ rotateY }}
        transition={{
          // spring gives the card a slight overshoot — it feels physical
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ── Back face (the "?" side) ──────────────────────────────────────
            No extra rotation — this face is visible at rotateY(0°).
            backfaceVisibility: hidden hides it once the container passes 90°. */}
        <div
          className={`
            absolute inset-0 rounded-xl
            flex items-center justify-center font-bold
            select-none
            ${isLocked
              ? "bg-gray-700 text-gray-600 opacity-40"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }
          `}
          style={{ backfaceVisibility: "hidden" }}
        >
          ?
        </div>

        {/* ── Front face (the symbol side) ─────────────────────────────────
            Pre-rotated 180° so it is hidden at rotateY(0°).
            When the container reaches rotateY(180°), this face's own 180° +
            the container's 180° = 360° = facing forward again. */}
        <motion.div
          className={`
            absolute inset-0 rounded-xl
            flex items-center justify-center font-bold
            select-none
            ${isMatched
              ? "bg-green-800 text-green-200"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            }
          `}
          style={{
            backfaceVisibility: "hidden",
            rotateY: 180, // pre-rotated so it hides at rest
          }}
          // Scale pop when matched — runs once when isMatched becomes true
          animate={isMatched ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={
            isMatched
              ? { type: "spring", stiffness: 400, damping: 15, delay: 0.15 }
              : {}
          }
        >
          {symbol}
        </motion.div>

      </motion.div>
    </div>
  );
}
