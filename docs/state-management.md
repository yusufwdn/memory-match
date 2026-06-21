# State Management

## What Is State?

State is any data that can change over time in the app.

In this game, state includes:
- The list of cards (and whether each is flipped or matched)
- How many moves the player has made
- How many matches they've found
- How much time has passed
- Whether the game is complete

When state changes, React automatically re-renders the components that depend on it. This is the core mechanic of React.

## Where State Lives

All game state lives inside the `useGameState` hook (`src/hooks/useGameState.ts`).

The hook returns:
- The current state values (to display)
- Handler functions (to call on user actions)

`page.tsx` calls the hook and passes everything down to components.

## State Shape

```typescript
type GameState = {
  cards: Card[];         // The board
  moves: number;         // Move counter
  matches: number;       // Match counter
  isComplete: boolean;   // Game over flag
  startTime: number | null; // When the first flip happened
  elapsedTime: number;   // Seconds elapsed
  score: number | null;  // null until game completes
};
```

Additional state in `useGameState`:

| State | Type | Purpose |
|---|---|---|
| `difficulty` | `Difficulty` | Current difficulty; loaded from Local Storage after mount |
| `bestScores` | `Record<Difficulty, GameScore>` | Best scores per difficulty; loaded from Local Storage after mount |
| `isNewBest` | `boolean` | True if the most recent game set a new personal record |
| `gameKey` | `number` | Incremented on new game/restart to remount Board and replay stagger animation |
| `flippedCardIds` | `string[]` | IDs of the 0–2 cards currently face-up but not yet resolved |

Additional state in `page.tsx` (UI state — not in the hook):

| State | Type | Purpose |
|---|---|---|
| `gamePhase` | `"lobby" \| "playing"` | Which screen is visible. Kept in the page because the hook manages game logic, not screen routing |

### SSR-Safe Initialization

Next.js renders components on the server before sending HTML to the browser. This means `useState` initializers run on both the server and the client. Two things must never happen in a `useState` initializer:

- **`Math.random()`** — shuffles differently on server vs. client → hydration mismatch on card symbols
- **`localStorage`** — doesn't exist on the server → crash or wrong value

The solution:
1. `useState` initializers use deterministic empty values (`buildEmptyState()` returns `cards: []`)
2. A `useEffect` runs after mount (client-only), reads `localStorage`, generates the shuffled deck, and updates state

```typescript
// Server and client both render the same empty state — no mismatch
const [gameState, setGameState] = useState<GameState>(buildEmptyState);

// After hydration, safe to call Math.random() and read localStorage
useEffect(() => {
  const difficulty = getLastDifficulty() ?? "easy";
  setGameState(buildInitialState(difficulty)); // Math.random() runs here, client-only
  setBestScores(getBestScores());              // localStorage read here, client-only
}, []);
```

## State Transitions

| User Action | What State Changes |
|---|---|
| First card flipped | `cards[i].isFlipped = true`, `startTime` set |
| Second card flipped | `cards[j].isFlipped = true`, `moves + 1` |
| Second card matches | `cards[i].isMatched = true`, `cards[j].isMatched = true`, `matches + 1` |
| Second card doesn't match | Both cards flip back after 1 second |
| All pairs found | `isComplete = true`, `score` calculated, timer stops, best score saved to Local Storage |
| New Game clicked | All state resets, new card set generated, `isNewBest` cleared |
| Restart clicked | All state resets, same card set reshuffled, `isNewBest` cleared |

## Local Storage

Two keys are persisted:

| Key | Value | When |
|---|---|---|
| `memory-match:best-scores` | `BestScores` JSON | After each game completion, if new best |
| `memory-match:last-difficulty` | `Difficulty` string | When New Game is called with a difficulty |

All reads/writes go through `src/lib/storage.ts`. The wrappers catch errors silently so the game still works in private browsing mode or when storage is unavailable.

## Why Not a Global State Library?

For this project, React's built-in `useState` inside a custom hook is sufficient. A library like Zustand would add complexity without benefit at this scale. If state management becomes painful (it likely won't), Zustand can be added later.
