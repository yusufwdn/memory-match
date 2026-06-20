"use client";

/**
 * page.tsx is the root of the Memory Match game.
 *
 * It calls useGameState() once and distributes the data downward.
 * No game logic lives here — this file only connects the hook to the UI.
 *
 * Data flow:
 *   useGameState → page.tsx → components (as props)
 */

import Board from "@/components/game/Board";
import GameControls from "@/components/game/GameControls";
import MoveCounter from "@/components/hud/MoveCounter";
import MatchCounter from "@/components/hud/MatchCounter";
import Timer from "@/components/hud/Timer";
import { useGameState } from "@/hooks/useGameState";
import { DIFFICULTY_CONFIG } from "@/constants/game";

export default function GamePage() {
  const { gameState, difficulty, handleNewGame, handleRestart } = useGameState();

  const { cards, moves, matches, elapsedTime } = gameState;
  const totalPairs = DIFFICULTY_CONFIG[difficulty].totalCards / 2;

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 gap-6">

      <h1 className="text-3xl font-bold tracking-tight">Memory Match</h1>

      {/* HUD: live stats while playing */}
      <div className="flex gap-8">
        <MoveCounter moves={moves} />
        <Timer elapsedTime={elapsedTime} />
        <MatchCounter matches={matches} totalPairs={totalPairs} />
      </div>

      {/* Card grid — receives cards and a placeholder flip handler */}
      <Board cards={cards} onCardClick={() => {}} />

      {/* Game controls */}
      <GameControls onNewGame={() => handleNewGame()} onRestart={handleRestart} />

    </main>
  );
}
