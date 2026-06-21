"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Board from "@/components/game/Board";
import GameControls from "@/components/game/GameControls";
import GameComplete from "@/components/game/GameComplete";
import LobbyScreen from "@/components/game/LobbyScreen";
import MoveCounter from "@/components/hud/MoveCounter";
import MatchCounter from "@/components/hud/MatchCounter";
import Timer from "@/components/hud/Timer";
import { useGameState } from "@/hooks/useGameState";
import { DIFFICULTY_CONFIG } from "@/constants/game";
import type { Difficulty } from "@/types/game";

// Two explicit phases so the board is never visible before the player starts.
type GamePhase = "lobby" | "playing";

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

  // Starts in "lobby" — the board is not rendered until the player presses Start.
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");

  const { cards, moves, matches, elapsedTime, isComplete } = gameState;
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalPairs = config.totalCards / 2;
  const currentBest = bestScores[difficulty];

  // Called from LobbyScreen when the player clicks "Start Game".
  function handleStart(d: Difficulty) {
    handleNewGame(d);
    setGamePhase("playing");
  }

  // Returns to the lobby without resetting the game — the current game
  // state is preserved until handleNewGame is called from the lobby.
  function handleGoToLobby() {
    setGamePhase("lobby");
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-6">

      {/* AnimatePresence lets the outgoing screen play its exit animation
          before the incoming screen mounts. mode="wait" ensures only one
          screen is visible at a time. */}
      <AnimatePresence mode="wait">

        {gamePhase === "lobby" ? (

          <LobbyScreen
            key="lobby"
            initialDifficulty={difficulty}
            bestScores={bestScores}
            onStart={handleStart}
          />

        ) : (

          <motion.div
            key="playing"
            className="flex flex-col items-center gap-6 sm:gap-8 w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >

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

            {/* Best score for this difficulty */}
            <p className="text-xs text-gray-600 -mt-4 sm:-mt-6 tabular-nums" aria-live="polite">
              {currentBest
                ? `Best (${config.label}): ${currentBest.score.toLocaleString()}`
                : `No record yet for ${config.label}`
              }
            </p>

            {/* Board */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 shadow-xl">
              <Board
                key={gameKey}
                cards={cards}
                difficulty={difficulty}
                isLocked={isLocked || isComplete}
                onCardClick={handleFlipCard}
              />
            </div>

            {/* Controls — New Game returns to lobby; Restart reshuffles in place */}
            <GameControls onNewGame={handleGoToLobby} onRestart={handleRestart} />

          </motion.div>

        )}

      </AnimatePresence>

      {/* Completion modal — only shown while in the playing phase.
          Gating on gamePhase prevents it from appearing over the lobby
          when the player navigates away before pressing Play Again. */}
      {gamePhase === "playing" && isComplete && gameState.score !== null && (
        <GameComplete
          moves={moves}
          elapsedTime={elapsedTime}
          totalPairs={totalPairs}
          score={gameState.score}
          difficultyLabel={config.label}
          previousBest={currentBest}
          isNewBest={isNewBest}
          onPlayAgain={handleRestart}
          onNewGame={handleGoToLobby}
        />
      )}

    </main>
  );
}
