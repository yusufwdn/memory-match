# Game Flow

## Full Game Lifecycle

```
App loads
    │
    ▼
page.tsx renders
    │
    ▼
useGameState initializes
    │  - generates cards for default difficulty (easy)
    │  - all cards face-down
    │  - moves = 0, matches = 0, isComplete = false
    │
    ▼
Player sees the board
    │
    ▼
Player flips Card A
    │  - card.isFlipped = true
    │  - startTime is set (timer begins)
    │
    ▼
Player flips Card B
    │  - card.isFlipped = true
    │  - moves += 1
    │
    ├─── Card A symbol === Card B symbol?
    │
    │   YES (Match)
    │    │  - card.isMatched = true for both
    │    │  - matches += 1
    │    │  - matches === totalPairs? → isComplete = true
    │    └──▶ Player chooses next cards
    │
    │   NO (No Match)
    │    │  - wait FLIP_BACK_DELAY_MS (1000ms)
    │    │  - card.isFlipped = false for both
    │    └──▶ Player tries again
    │
    ▼
Game Complete
    │  - timer stops
    │  - score calculated
    │  - best score updated if beaten
    │  - completion modal shown
    │
    ▼
Player clicks New Game or Restart
    │
    └──▶ Back to start
```

## Flip Lock

While two unmatched cards are visible (during the 1-second delay before they flip back), the board is locked. The player cannot flip a third card.

This lock prevents cheating and ensures the game state stays consistent.

## Timer Behaviour

- Timer does NOT start when the page loads.
- Timer starts on the player's first card flip.
- Timer stops when `isComplete` becomes true.
- Restarting or starting a new game resets the timer.
