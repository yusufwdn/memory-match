"use client";

type MoveCounterProps = {
  moves: number;
};

export default function MoveCounter({ moves }: MoveCounterProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Moves</p>
      <p className="text-2xl font-bold text-white" aria-live="polite" aria-atomic="true">
        {moves}
      </p>
    </div>
  );
}
