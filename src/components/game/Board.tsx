"use client";

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

export default function Board({ cards, difficulty, isLocked, onCardClick }: BoardProps) {
  return (
    <div className={`grid ${GRID_COLS[difficulty]} gap-3`}>
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          size={CARD_SIZE[difficulty]}
          isLocked={isLocked}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
