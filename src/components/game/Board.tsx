"use client";

import type { Card } from "@/types/game";
import CardComponent from "./Card";

type BoardProps = {
  cards: Card[];
  onCardClick: (cardId: string) => void;
};

/**
 * Board renders the grid of cards.
 *
 * The grid uses CSS Grid with auto-fit columns so the layout adapts
 * to the number of cards. Phase 3 will refine this into a proper
 * difficulty-aware grid (4×3, 4×4, 6×4).
 */
export default function Board({ cards, onCardClick }: BoardProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
