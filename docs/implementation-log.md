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

*Future phases will append entries below this line.*
