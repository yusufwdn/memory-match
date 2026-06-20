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

---

## Phase 3 — Board Rendering

**Date:** 2026-06-21

### What Was Built

- `Board.tsx` — difficulty-aware grid columns via a static lookup map (`GRID_COLS`)
- `Card.tsx` — size variants (`md` / `sm`) so hard mode cards fit 6 columns
- `page.tsx` — polished layout: dark card containers, dividers in HUD, difficulty label under title

### Key Decisions

**Static lookup map instead of dynamic Tailwind interpolation:** Tailwind scans source at build time. Interpolated strings like `` `grid-cols-${n}` `` are invisible to the scanner and silently fail. All class names must be literal strings.

**Size passed as a prop to Card:** The board knows the difficulty; each card should not need to know it. The board translates difficulty → size and passes that down — cleaner separation of concerns.

**`bg-gray-950` for the page background:** Slightly darker than `bg-gray-900` (used for the board/HUD panels) creates visible depth without a heavy drop shadow.

### Files Modified

| File | Change |
|---|---|
| `src/components/game/Board.tsx` | Difficulty-aware grid; passes size to Card |
| `src/components/game/Card.tsx` | Size variants; polished colour states |
| `src/app/page.tsx` | Passes difficulty to Board; polished layout |

---

## Phase 4 — Card Flip Interaction

**Date:** 2026-06-21

### What Was Built

- `src/lib/gameLogic.ts` — `checkMatch(cardA, cardB)` and `isGameComplete(cards)` pure functions
- `src/hooks/useGameState.ts` — `handleFlipCard` with full flip cycle: flip lock, timer start, match detection, flip-back timeout, `isComplete` detection
- `src/app/page.tsx` — wires `handleFlipCard` to Board; shows temporary win banner when `isComplete` is true

### How the Flip Cycle Works

1. Click card A → `isFlipped: true`, `startTime` set, `flippedCardIds = [A]`
2. Click card B → `isFlipped: true`, `moves + 1`
   - **Match:** both cards `isMatched: true`, `isFlipped: false`, `matches + 1`, `flippedCardIds = []`
   - **No match:** `moves + 1`, timeout queued — after 1000ms both flip back, `flippedCardIds = []`
3. While `flippedCardIds.length === 2` — all clicks are ignored (board lock)

### Key Decisions

**`useRef` for timeout ID:** Changing the timeout reference should not re-render the component. `useRef` persists a value across renders without triggering re-renders.

**Match computed before `setGameState`:** The match result is derived synchronously from `gameState.cards` before the state update. This makes the same result available inside the functional update AND in the timeout scheduling below — avoiding duplicate logic.

**`isComplete` set in the same state update as the match:** Combining them into one update ensures React never renders a "matched but not complete" frame for the final pair.

**`clearFlipTimeout` on New Game and Restart:** Without this, a pending flip-back timeout could fire after reset and corrupt the new game's card state.

### Files Modified

| File | Change |
|---|---|
| `src/lib/gameLogic.ts` | Added `checkMatch` and `isGameComplete` |
| `src/hooks/useGameState.ts` | Full flip cycle with lock, timer, match, timeout |
| `src/app/page.tsx` | Wired flip handler; added temporary win banner |

---

## Phase 5 — Match Detection Polish

**Date:** 2026-06-21

### What Was Built

- `useGameState` — exposes `isLocked` as a derived value (`flippedCardIds.length === 2`)
- `Board` — accepts and forwards `isLocked` to each Card
- `Card` — new visual state: face-down + locked = dimmed + `cursor-not-allowed`; face-down + open = hoverable + subtle scale on hover

### Key Decisions

**`isLocked` is derived, not stored:** Computing it from `flippedCardIds.length` at the return statement means it is always correct without manual sync. Storing it separately in `useState` would require updating it in every code path that changes `flippedCardIds`.

**`disabled` prop set from `isInteractable`:** Instead of duplicating the disabled logic, `isInteractable` is derived once and used for both the `disabled` attribute and the CSS class selection. Single source of truth.

**`opacity-40` on locked unflipped cards:** Strong enough to signal "not available" without making the board feel broken. The two face-up cards stay full opacity so the player's eye goes there naturally.

**`hover:scale-105` on open cards:** Subtle scale on hover confirms interactability without being distracting. Only applied when the card is actually clickable.

### Files Modified

| File | Change |
|---|---|
| `src/hooks/useGameState.ts` | Added `isLocked` derived value to return |
| `src/components/game/Board.tsx` | Accepts and forwards `isLocked` |
| `src/components/game/Card.tsx` | Four visual states; `isInteractable` derived prop |
| `src/app/page.tsx` | Passes `isLocked` to Board |

*Future phases will append entries below this line.*
