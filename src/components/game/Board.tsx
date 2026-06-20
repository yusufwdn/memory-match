"use client";

import { motion } from "framer-motion";
import type { Card, Difficulty } from "@/types/game";
import CardComponent from "./Card";

type BoardProps = {
  cards: Card[];
  difficulty: Difficulty;
  isLocked: boolean;
  onCardClick: (cardId: string) => void;
};

/**
 * Maps each difficulty to its Tailwind grid-cols class.
 * Must be complete literals — not interpolated — for Tailwind's
 * build-time scanner to include them in the CSS bundle.
 */
const GRID_COLS: Record<Difficulty, string> = {
  easy:   "grid-cols-4",
  medium: "grid-cols-4",
  hard:   "grid-cols-6",
};

const CARD_SIZE: Record<Difficulty, "md" | "sm"> = {
  easy:   "md",
  medium: "md",
  hard:   "sm",
};

/**
 * Variants define a named set of animation states.
 * "hidden" is the initial state; "show" is the animated target.
 *
 * staggerChildren: each child that also uses variants gets a 40ms
 * offset from the previous one, creating a cascade effect.
 */
const boardVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  show:   { opacity: 1, scale: 1,    transition: { type: "spring" as const, stiffness: 300, damping: 22 } },
};

export default function Board({ cards, difficulty, isLocked, onCardClick }: BoardProps) {
  return (
    // role="grid" tells screen readers this is an interactive grid, not just a list.
    <motion.div
      role="grid"
      aria-label={`Memory card grid, ${CARD_SIZE[difficulty] === "sm" ? "hard" : difficulty} mode`}
      className={`grid ${GRID_COLS[difficulty]} gap-3`}
      variants={boardVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, index) => (
        // motion.div wrapper applies the per-card entrance variant.
        // role="gridcell" marks each cell for screen reader navigation.
        <motion.div key={card.id} role="gridcell" variants={cardVariants}>
          <CardComponent
            card={card}
            size={CARD_SIZE[difficulty]}
            isLocked={isLocked}
            index={index}
            onClick={() => onCardClick(card.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
