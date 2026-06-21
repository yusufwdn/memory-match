# Game Flow

## Full Game Lifecycle

```
App loads
    │
    ▼
page.tsx renders  (gamePhase = "lobby")
    │
    ▼
useGameState initializes
    │  - server render: empty card array, difficulty = "easy" (SSR-safe, no localStorage)
    │  - after mount (useEffect): reads last difficulty + best scores from Local Storage
    │  - generates shuffled card deck (Math.random() runs client-side only)
    │
    ▼
LobbyScreen renders
    │  - floating card background animation plays
    │  - flip preview row cycles through symbols
    │  - player's previous best scores shown on each difficulty option
    │
    ▼
Player selects difficulty and clicks "Start Game"
    │  - handleNewGame(difficulty) called
    │  - gamePhase = "playing"
    │
    ▼
Playing screen fades in (AnimatePresence transition)
    │
    ▼
Player sees the board (cards entrance stagger animation plays)
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
Player clicks Restart
    │  - board resets with same difficulty
    └──▶ Back to start

Player clicks New Game
    │  - gamePhase = "lobby"
    │  - LobbyScreen renders with current best scores
    │  - Player selects difficulty and clicks Start
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
