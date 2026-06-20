"use client";

type MatchCounterProps = {
  matches: number;
  totalPairs: number;
};

export default function MatchCounter({ matches, totalPairs }: MatchCounterProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Matches</p>
      <p className="text-2xl font-bold text-white" aria-live="polite" aria-atomic="true"
         aria-label={`${matches} of ${totalPairs} pairs matched`}>
        {matches}
        <span className="text-sm text-gray-400 font-normal"> / {totalPairs}</span>
      </p>
    </div>
  );
}
