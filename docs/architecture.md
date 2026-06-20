# Architecture

## Folder Structure

```
src/
├── app/                    ← Next.js App Router
│   ├── layout.tsx          ← Root layout: fonts, metadata, global styles
│   └── page.tsx            ← Game shell: calls useGameState, renders components
│
├── components/
│   ├── game/
│   │   ├── Board.tsx         ← Card grid layout (stagger entrance animation)
│   │   ├── Card.tsx          ← Individual card (3D flip, matched pop)
│   │   ├── DifficultyModal.tsx ← Difficulty picker shown on "New Game"
│   │   └── GameControls.tsx  ← New Game and Restart buttons
│   │
│   ├── hud/
│   │   ├── MoveCounter.tsx ← Shows move count
│   │   ├── MatchCounter.tsx← Shows matches found / total pairs
│   │   └── Timer.tsx       ← Shows elapsed time
│   │
│   └── ui/
│       └── Button.tsx      ← Reusable button (primary / secondary / danger)
│
├── hooks/
│   ├── useGameState.ts     ← All core game state and logic
│   └── useTimer.ts         ← Timer tick logic (isolated from game state)
│
├── lib/
│   ├── cardUtils.ts        ← Card generation, deck shuffling (pure functions)
│   ├── gameLogic.ts        ← Match detection, score calculation (pure functions)
│   └── storage.ts          ← Local Storage read/write wrappers
│
├── types/
│   └── game.ts             ← TypeScript types: Card, GameState, Difficulty, Score
│
└── constants/
    └── game.ts             ← Symbols, difficulty configs, timings, storage keys
```

## Design Principles

### 1. Components Only Display Data
Components receive data as props. They do not fetch, calculate, or store anything on their own. All logic lives in hooks and lib.

### 2. Hooks Own Logic and State
`useGameState` is the single owner of the game's state. This keeps components simple and reusable.

### 3. Lib Contains Zero React
Functions in `lib/` are plain TypeScript. They can be imported anywhere, including potential future tests, without needing a React environment.

### 4. Types Are the Contract
Every data shape (Card, GameState, Difficulty) is defined in `types/game.ts`. Changing a type here causes TypeScript to flag every file that is affected.

## Data Flow

```
Local Storage
     │
     │  getLastDifficulty(), getBestScores()  (on init)
     ▼
useGameState (hook)
     │
     │  cards, moves, matches, isComplete, elapsedTime, score
     │  bestScores, isNewBest
     │  onFlipCard, onNewGame, onRestart
     ▼
 page.tsx (root)
     │
     ├──▶ Board.tsx ──▶ Card.tsx (×N)
     ├──▶ MoveCounter.tsx
     ├──▶ MatchCounter.tsx
     ├──▶ Timer.tsx
     ├──▶ GameControls.tsx
     └──▶ GameComplete.tsx (bestScores, isNewBest)
                               │
                               │  saveBestScoreIfBeaten()  (on game complete)
                               ▼
                         Local Storage
```

Data always flows **downward**. Components never talk directly to each other.
