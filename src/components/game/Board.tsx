"use client";

/**
 * Board renders the grid of cards.
 *
 * It receives the card data from useGameState (in page.tsx)
 * and maps each card to a <Card /> component.
 *
 * The grid layout is controlled by the difficulty setting —
 * easy uses 4×3, medium uses 4×4, hard uses 6×4.
 */
export default function Board() {
  // Phase 3: will receive cards and onCardClick as props.
  return (
    <div className="flex items-center justify-center">
      <p className="text-gray-400 text-sm">Board — Phase 3</p>
    </div>
  );
}
