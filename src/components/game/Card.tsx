"use client";

/**
 * Card renders a single card on the board.
 *
 * It has two visual states:
 *   - Face-down: shows a hidden back face
 *   - Face-up: shows the symbol (emoji)
 *
 * The visual flip animation (Phase 10) will be added using Framer Motion.
 * For now it renders a basic placeholder.
 */
export default function Card() {
  // Phase 2 & 4: will receive card data and onClick handler as props.
  return (
    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer">
      <span className="text-gray-400 text-xs">?</span>
    </div>
  );
}
