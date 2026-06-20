"use client";

import Button from "@/components/ui/Button";

type GameControlsProps = {
  onNewGame: () => void;
  onRestart: () => void;
};

export default function GameControls({ onNewGame, onRestart }: GameControlsProps) {
  return (
    <div className="flex gap-3">
      <Button variant="primary" onClick={onNewGame}>
        New Game
      </Button>
      <Button variant="secondary" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}
