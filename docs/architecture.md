# Architecture

## Folder Structure

```
src/
├── app/                    ← Next.js App Router
│   ├── icon.svg            ← Custom favicon (memory card icon — auto-registered by Next.js)
│   ├── layout.tsx          ← Root layout: fonts, metadata ("Memory Match"), global styles
│   └── page.tsx            ← Game shell: gamePhase state, AnimatePresence, renders screens
│
├── components/
│   ├── game/
│   │   ├── Board.tsx         ← Card grid layout (stagger entrance animation)
│   │   ├── Card.tsx          ← Individual card (3D flip, matched pop, keyboard nav)
│   │   ├── GameComplete.tsx  ← Completion modal (score, new-best badge, play again)
│   │   ├── GameControls.tsx  ← New Game and Restart buttons (shown during play)
│   │   └── LobbyScreen.tsx   ← Full-viewport lobby: difficulty picker, floating card
│   │                           animations, flip preview row
│   ├── hud/
│   │   ├── MoveCounter.tsx ← Shows move count (aria-live)
│   │   ├── MatchCounter.tsx← Shows matches found / total pairs (aria-live)
│   │   └── Timer.tsx       ← Shows elapsed time
│   │
│   └── ui/
│       └── Button.tsx      ← Reusable button (primary / secondary / danger)
│
├── hooks/
│   ├── useGameState.ts     ← All core game state and logic (SSR-safe initialization)
│   └── useTimer.ts         ← Timer tick logic (isolated from game state)
│
├── lib/
│   ├── cardUtils.ts        ← Card generation, deck shuffling (pure functions)
│   ├── gameLogic.ts        ← Match detection, score calculation (pure functions)
│   └── storage.ts          ← Local Storage read/write wrappers (SSR-safe)
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
     │  getLastDifficulty(), getBestScores()  (useEffect after mount — SSR-safe)
     ▼
useGameState (hook)
     │
     │  cards, moves, matches, isComplete, elapsedTime, score
     │  difficulty, bestScores, isNewBest, gameKey, isLocked
     │  handleFlipCard, handleNewGame, handleRestart
     ▼
 page.tsx (root)
     │
     │  gamePhase: "lobby" | "playing"
     │
     ├── gamePhase === "lobby"
     │    └──▶ LobbyScreen.tsx  (initialDifficulty, bestScores, onStart)
     │
     └── gamePhase === "playing"
          ├──▶ MoveCounter.tsx
          ├──▶ MatchCounter.tsx
          ├──▶ Timer.tsx
          ├──▶ Board.tsx ──▶ Card.tsx (×N)
          ├──▶ GameControls.tsx
          └──▶ GameComplete.tsx (bestScores, isNewBest)
                                    │
                                    │  saveBestScoreIfBeaten()  (on game complete)
                                    ▼
                              Local Storage
```

Data always flows **downward**. Components never talk directly to each other.

`gamePhase` is UI state — it lives in `page.tsx`, not the hook. The hook manages game logic; which screen is visible is a presentation decision.
