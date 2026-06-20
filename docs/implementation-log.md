# Implementation Log

A chronological record of what was built, when, and why.

---

## Phase 1 — Project Setup & Architecture

**Date:** 2026-06-21

### What Was Built

- Initialized Next.js 15 project with TypeScript, Tailwind CSS, ESLint, App Router
- Created feature-based folder structure under `src/`
- Defined all TypeScript types: `Card`, `GameState`, `Difficulty`, `DifficultyConfig`, `GameScore`, `BestScores`
- Defined all constants: card symbols, difficulty configs, timing values, storage keys
- Created empty scaffold components: `Board`, `Card`, `GameControls`, `MoveCounter`, `MatchCounter`, `Timer`, `Button`
- Created empty hook stubs: `useGameState`, `useTimer`
- Created empty lib stubs: `cardUtils`, `gameLogic`, `storage`
- Updated `page.tsx` as the game shell
- Created all 6 documentation files

### Key Decisions

**Chose Next.js over plain Vite:** Next.js is industry-standard and sets up good habits (App Router, file-based routing) even though this game won't need SSR.

**Feature-based folders over type-based folders:** `components/game/` is easier to navigate than a flat `components/` folder with 10+ files.

**TypeScript types defined before any logic:** Designing the data shapes first forces you to think about what the application actually needs before writing code.

**`useGameState` as single logic owner:** Components stay dumb. The hook is smart. This separation makes each part easier to understand and change.

### Files Created

| File | Purpose |
|---|---|
| `src/types/game.ts` | All TypeScript types |
| `src/constants/game.ts` | Symbols, difficulty configs, constants |
| `src/components/game/Board.tsx` | Card grid scaffold |
| `src/components/game/Card.tsx` | Card scaffold |
| `src/components/game/GameControls.tsx` | Buttons scaffold |
| `src/components/hud/MoveCounter.tsx` | Moves display scaffold |
| `src/components/hud/MatchCounter.tsx` | Matches display scaffold |
| `src/components/hud/Timer.tsx` | Timer display scaffold |
| `src/components/ui/Button.tsx` | Reusable button |
| `src/hooks/useGameState.ts` | Game logic hook stub |
| `src/hooks/useTimer.ts` | Timer hook stub |
| `src/lib/cardUtils.ts` | Card utility stub |
| `src/lib/gameLogic.ts` | Game logic stub |
| `src/lib/storage.ts` | Storage wrapper stub |
| `src/app/page.tsx` | Game shell (root page) |
| `docs/project-overview.md` | Project overview |
| `docs/architecture.md` | Architecture documentation |
| `docs/state-management.md` | State management documentation |
| `docs/game-flow.md` | Game flow documentation |
| `docs/learning-notes.md` | Learning notes |
| `docs/implementation-log.md` | This file |

---

---

## Phase 2 — Card Data Model

**Date:** 2026-06-21

### What Was Built

- Implemented `shuffleArray<T>` using the Fisher-Yates algorithm in `src/lib/cardUtils.ts`
- Implemented `generateCards(difficulty)` — selects symbols, duplicates into pairs, shuffles, assigns unique IDs
- Implemented `useGameState` hook with `useState`, `useCallback`, `buildInitialState`, `handleNewGame`, `handleRestart`
- Updated `page.tsx` to call `useGameState` and pass data to all components as props
- Updated all components to accept and render real props: `Board`, `Card`, `MoveCounter`, `MatchCounter`, `Timer`, `GameControls`

### Key Decisions

**Single state object for GameState:** Grouping all game state into one object makes reset trivial — replace the whole object with a fresh one. Individual `useState` calls for each field would require multiple setters on reset.

**`buildInitialState` as a plain function outside the hook:** Both the initial `useState` call and `handleNewGame` need to build a clean state. Extracting it avoids code duplication.

**`useCallback` on handlers:** Prevents React from recreating handler functions on every render. A good habit even when not strictly necessary for performance at this scale.

**Board uses a flat `grid-cols-4` for now:** Phase 3 will make the grid difficulty-aware (4×3 / 4×4 / 6×4). Hardcoding it now avoids over-engineering before the board rendering phase.

### Files Modified

| File | Change |
|---|---|
| `src/lib/cardUtils.ts` | Implemented `shuffleArray` and `generateCards` |
| `src/hooks/useGameState.ts` | Implemented hook with state and handlers |
| `src/app/page.tsx` | Wired hook; passes props to all components |
| `src/components/game/Board.tsx` | Accepts `cards` and `onCardClick` props |
| `src/components/game/Card.tsx` | Renders face-down / face-up / matched states |
| `src/components/game/GameControls.tsx` | Accepts `onNewGame` and `onRestart` props |
| `src/components/hud/MoveCounter.tsx` | Accepts `moves` prop |
| `src/components/hud/MatchCounter.tsx` | Accepts `matches` and `totalPairs` props |
| `src/components/hud/Timer.tsx` | Accepts `elapsedTime` prop; formats as MM:SS |

*Future phases will append entries below this line.*
