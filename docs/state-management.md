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
};
```

## State Transitions

| User Action | What State Changes |
|---|---|
| First card flipped | `cards[i].isFlipped = true`, `startTime` set |
| Second card flipped | `cards[j].isFlipped = true`, `moves + 1` |
| Second card matches | `cards[i].isMatched = true`, `cards[j].isMatched = true`, `matches + 1` |
| Second card doesn't match | Both cards flip back after 1 second |
| All pairs found | `isComplete = true`, timer stops |
| New Game clicked | All state resets, new card set generated |
| Restart clicked | All state resets, same card set reshuffled |

## Why Not a Global State Library?

For this project, React's built-in `useState` inside a custom hook is sufficient. A library like Zustand would add complexity without benefit at this scale. If state management becomes painful (it likely won't), Zustand can be added later.
