"use client";

import { useState } from "react";
import Board from "@/components/game/Board";
import GameControls from "@/components/game/GameControls";
import GameComplete from "@/components/game/GameComplete";
import DifficultyModal from "@/components/game/DifficultyModal";
import MoveCounter from "@/components/hud/MoveCounter";
import MatchCounter from "@/components/hud/MatchCounter";
import Timer from "@/components/hud/Timer";
import { useGameState } from "@/hooks/useGameState";
import { DIFFICULTY_CONFIG } from "@/constants/game";
import type { Difficulty } from "@/types/game";

export default function GamePage() {
  const {
    gameState,
    difficulty,
    isLocked,
    bestScores,
    isNewBest,
    gameKey,
    handleFlipCard,
    handleNewGame,
    handleRestart,
  } = useGameState();

  // Controls whether the difficulty picker modal is open.
  // This is UI state — it doesn't belong in the game hook.
  const [isSelectingDifficulty, setIsSelectingDifficulty] = useState(false);

  const { cards, moves, matches, elapsedTime, isComplete } = gameState;
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalPairs = config.totalCards / 2;
  const currentBest = bestScores[difficulty];

  // Called when the player confirms a difficulty in the modal.
  function handleDifficultySelect(d: Difficulty) {
    setIsSelectingDifficulty(false);
    handleNewGame(d);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 gap-6 sm:gap-8">

      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Memory Match
        </h1>
        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">
          {config.label} Mode
        </p>
      </div>

      {/* HUD */}
      <div className="flex gap-6 sm:gap-10 bg-gray-900 rounded-2xl px-6 sm:px-8 py-4 border border-gray-800">
        <MoveCounter moves={moves} />
        <div className="w-px bg-gray-800" />
        <Timer elapsedTime={elapsedTime} />
        <div className="w-px bg-gray-800" />
        <MatchCounter matches={matches} totalPairs={totalPairs} />
      </div>

      {/* Best score for the current difficulty — shown between games */}
      <p className="text-xs text-gray-600 -mt-4 sm:-mt-6 tabular-nums" aria-live="polite">
        {currentBest
          ? `Best (${config.label}): ${currentBest.score.toLocaleString()}`
          : `No record yet for ${config.label}`
        }
      </p>

      {/* Board — frozen (isLocked=true) when game is complete.
          The key prop forces a full remount on new game / restart,
          which triggers the stagger entrance animation in Board. */}
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 shadow-xl">
        <Board
          key={gameKey}
          cards={cards}
          difficulty={difficulty}
          isLocked={isLocked || isComplete}
          onCardClick={handleFlipCard}
        />
      </div>

      {/* Controls */}
      <GameControls
        onNewGame={() => setIsSelectingDifficulty(true)}
        onRestart={handleRestart}
      />

      {/* Difficulty picker modal */}
      {isSelectingDifficulty && (
        <DifficultyModal
          current={difficulty}
          onSelect={handleDifficultySelect}
          onClose={() => setIsSelectingDifficulty(false)}
        />
      )}

      {/* Completion modal — rendered on top of everything when game is won */}
      {isComplete && gameState.score !== null && (
        <GameComplete
          moves={moves}
          elapsedTime={elapsedTime}
          totalPairs={totalPairs}
          score={gameState.score}
          difficultyLabel={config.label}
          previousBest={currentBest}
          isNewBest={isNewBest}
          onPlayAgain={handleRestart}
          onNewGame={() => setIsSelectingDifficulty(true)}
        />
      )}

    </main>
  );
}
