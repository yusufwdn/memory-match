"use client";

import type { Card, Difficulty } from "@/types/game";
import CardComponent from "./Card";

type BoardProps = {
  cards: Card[];
  difficulty: Difficulty;
  onCardClick: (cardId: string) => void;
};

/**
 * Maps each difficulty to its Tailwind grid-cols class.
 *
 * These must be written as complete literal strings, not interpolated
 * (e.g. NOT `grid-cols-${n}`). Tailwind scans source files for class
 * names at build time — interpolated strings are invisible to the scanner
 * and the resulting class will not be included in the CSS bundle.
 */
const GRID_COLS: Record<Difficulty, string> = {
  easy:   "grid-cols-4",
  medium: "grid-cols-4",
  hard:   "grid-cols-6",
};

/**
 * Maps difficulty to card size.
 * Hard mode packs 6 columns so cards must be smaller to fit the screen.
 */
const CARD_SIZE: Record<Difficulty, "md" | "sm"> = {
  easy:   "md",
  medium: "md",
  hard:   "sm",
};

export default function Board({ cards, difficulty, onCardClick }: BoardProps) {
  return (
    <div className={`grid ${GRID_COLS[difficulty]} gap-3`}>
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          size={CARD_SIZE[difficulty]}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
