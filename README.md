# Memory Match

A browser-based card-matching memory game. Flip cards to find all matching pairs as fast as you can with as few moves as possible.

## Features

- Three difficulty levels — Easy (4×3), Medium (4×4), Hard (6×4)
- Lobby screen with animated flip preview and floating card background
- 3D card flip animations with spring physics
- Move counter, live timer, and scoring system
- Personal best scores saved per difficulty (Local Storage)
- Fully keyboard-accessible — play without a mouse
- SSR-safe — no hydration mismatches

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework (App Router) |
| React | 19 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yusufwdn/memory-match.git
cd memory-match

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build   # Production build
npm run start   # Serve the production build
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── app/               # Next.js App Router (pages, layout, favicon)
├── components/
│   ├── game/          # Board, Card, LobbyScreen, GameComplete, GameControls
│   ├── hud/           # MoveCounter, MatchCounter, Timer
│   └── ui/            # Shared Button component
├── hooks/             # useGameState (all logic), useTimer
├── lib/               # Pure functions: cardUtils, gameLogic, storage
├── types/             # TypeScript types
└── constants/         # Card symbols, difficulty configs, timings
```

## Documentation

Full development documentation lives in [`docs/`](docs/):

| File | Contents |
|---|---|
| [`project-overview.md`](docs/project-overview.md) | Goals, features, tech stack |
| [`architecture.md`](docs/architecture.md) | Folder structure, data flow |
| [`game-flow.md`](docs/game-flow.md) | Full lifecycle from lobby to game complete |
| [`state-management.md`](docs/state-management.md) | State shape, transitions, SSR safety |
| [`learning-notes.md`](docs/learning-notes.md) | React/TypeScript concepts explained from scratch |
| [`implementation-log.md`](docs/implementation-log.md) | Chronological build log with decisions |

This project was built phase by phase as a teaching exercise. The docs explain every concept introduced along the way, written for someone learning frontend development.
