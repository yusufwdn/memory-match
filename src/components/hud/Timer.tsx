"use client";

type TimerProps = {
  elapsedTime: number; // seconds
};

/**
 * Formats a raw second count into MM:SS display string.
 * e.g. 90 seconds → "01:30"
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  // padStart(2, "0") ensures single digits get a leading zero: 5 → "05"
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function Timer({ elapsedTime }: TimerProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
      <p className="text-2xl font-bold text-white font-mono">
        {formatTime(elapsedTime)}
      </p>
    </div>
  );
}
