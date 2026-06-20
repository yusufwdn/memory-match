"use client";

/**
 * page.tsx is the root of the Memory Match game.
 *
 * This file is intentionally simple — it is the "orchestrator".
 * It will call useGameState() to get all game data and handlers,
 * then pass that data down to child components as props.
 *
 * Think of it like a TV remote control:
 *   - The remote (page.tsx) holds all the buttons (handlers).
 *   - The TV screen (components) just shows what it receives.
 *
 * Data flows ONE direction: page.tsx → components.
 * This is the "unidirectional data flow" principle in React.
 */

import Board from "@/components/game/Board";
import GameControls from "@/components/game/GameControls";
import MoveCounter from "@/components/hud/MoveCounter";
import MatchCounter from "@/components/hud/MatchCounter";
import Timer from "@/components/hud/Timer";

export default function GamePage() {
  // Phase 2: useGameState() will be called here.
  // All game data and handlers will come from that hook.

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 gap-6">

      {/* Game title */}
      <h1 className="text-3xl font-bold tracking-tight">Memory Match</h1>

      {/* HUD: stats shown while playing */}
      <div className="flex gap-8">
        <MoveCounter />
        <Timer />
        <MatchCounter />
      </div>

      {/* The card grid */}
      <Board />

      {/* New Game / Restart controls */}
      <GameControls />

    </main>
  );
}
