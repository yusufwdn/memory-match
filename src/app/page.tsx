"use client";

import Board from "@/components/game/Board";
import GameControls from "@/components/game/GameControls";
import GameComplete from "@/components/game/GameComplete";
import MoveCounter from "@/components/hud/MoveCounter";
import MatchCounter from "@/components/hud/MatchCounter";
import Timer from "@/components/hud/Timer";
import { useGameState } from "@/hooks/useGameState";
import { DIFFICULTY_CONFIG } from "@/constants/game";

export default function GamePage() {
  const {
    gameState,
    difficulty,
    isLocked,
    bestScores,
    isNewBest,
    handleFlipCard,
    handleNewGame,
    handleRestart,
  } = useGameState();

  const { cards, moves, matches, elapsedTime, isComplete } = gameState;
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalPairs = config.totalCards / 2;

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-8">

      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Memory Match
        </h1>
        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">
          {config.label}
        </p>
      </div>

      {/* HUD */}
      <div className="flex gap-10 bg-gray-900 rounded-2xl px-8 py-4 border border-gray-800">
        <MoveCounter moves={moves} />
        <div className="w-px bg-gray-800" />
        <Timer elapsedTime={elapsedTime} />
        <div className="w-px bg-gray-800" />
        <MatchCounter matches={matches} totalPairs={totalPairs} />
      </div>

      {/* Board — frozen (isLocked=true) when game is complete */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
        <Board
          cards={cards}
          difficulty={difficulty}
          isLocked={isLocked || isComplete}
          onCardClick={handleFlipCard}
        />
      </div>

      {/* Controls */}
      <GameControls onNewGame={() => handleNewGame()} onRestart={handleRestart} />

      {/* Completion modal — rendered on top of everything when game is won */}
      {isComplete && gameState.score !== null && (
        <GameComplete
          moves={moves}
          elapsedTime={elapsedTime}
          totalPairs={totalPairs}
          score={gameState.score}
          difficultyLabel={config.label}
          previousBest={bestScores[difficulty]}
          isNewBest={isNewBest}
          onPlayAgain={handleRestart}
          onNewGame={() => handleNewGame()}
        />
      )}

    </main>
  );
}
