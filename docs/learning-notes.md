# Learning Notes

This document explains React and TypeScript concepts introduced in each phase.
It is written for someone learning frontend development from scratch.

---

## Phase 1 — TypeScript Types

### What Are Types?

A type is a description of what shape a piece of data must have.

Imagine ordering a package. Before the box arrives, you know:
- It is a rectangle
- It has a width, height, and depth (all numbers)
- It has a label (string)

TypeScript types work the same way. You describe the shape of data before it exists.

### Example from this project

```typescript
type Card = {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};
```

This tells TypeScript: "every Card object must have these four fields with these types."

If you try to write `card.isFlipe = true` (typo), TypeScript catches it immediately — before you ever run the code.

### Union Types

```typescript
type Difficulty = "easy" | "medium" | "hard";
```

This means the `Difficulty` type can only ever be one of those three exact strings. TypeScript will warn you if you accidentally write `"Meduim"`.

---

## Phase 1 — Component Architecture

### What Is a Component?

A React component is a function that returns JSX (the HTML-like syntax used in React).

```typescript
function Card() {
  return <div>Hello</div>;
}
```

### Why Small Components?

Each component in this project has one job:
- `Card` just displays one card
- `Timer` just displays the time
- `Board` just lays out the cards in a grid

This is the **Single Responsibility Principle**: one thing does one thing well.

### Props

Props are how a parent component passes data to a child component.

```typescript
// Parent passes data
<MoveCounter moves={7} />

// Child receives and uses it
function MoveCounter({ moves }: { moves: number }) {
  return <p>{moves}</p>;
}
```

We will use this pattern heavily starting in Phase 3.

---

---

## Phase 2 — useState and useCallback

### useState

`useState` is the most fundamental React hook. It stores a value and tells React to re-render when that value changes.

```typescript
const [moves, setMoves] = useState(0);
```

- `moves` is the current value
- `setMoves` is the function you call to change it
- Calling `setMoves(1)` triggers a re-render — the component updates to show `1`

You never assign directly: `moves = 1` does NOT work in React. You must call the setter.

### useState with a function (lazy initializer)

```typescript
const [gameState, setGameState] = useState<GameState>(() =>
  buildInitialState("easy")
);
```

Passing a **function** to `useState` (not a value) is called a "lazy initializer." React calls it once on the first render and ignores it after that.

This matters when the initial value is expensive to calculate. Without the function, React would re-run `buildInitialState("easy")` on every render — even though it only uses the result once.

### useCallback

`useCallback` wraps a function so React doesn't recreate it on every render:

```typescript
const handleNewGame = useCallback(() => {
  setGameState(buildInitialState(difficulty));
}, [difficulty]);
```

The second argument `[difficulty]` is the "dependency array." React only creates a new function when `difficulty` changes. Otherwise it reuses the same function reference.

**Why does this matter?** If you pass a handler to a child component, and the handler is recreated every render, React sees it as a "changed prop" and re-renders the child unnecessarily.

### Custom Hooks

A custom hook is a plain function whose name starts with `use`. It can call other hooks (`useState`, `useCallback`, etc.).

```typescript
function useGameState() {
  const [moves, setMoves] = useState(0);
  // ...
  return { moves, handleNewGame };
}
```

By putting logic in a hook instead of a component, the logic becomes:
- Reusable (multiple components could call the same hook)
- Testable (the hook can be tested without rendering anything)
- Clean (the component file stays small)

---

---

## Phase 3 — Tailwind Dynamic Classes

### The Problem

Tailwind CSS works by scanning your source files at build time to find every class name you use. It then only includes those classes in the final CSS bundle — this is why Tailwind files are tiny.

The side effect: if a class name only exists as a string at runtime (not visible in the source), Tailwind won't include it.

### Wrong Approach

```typescript
// Tailwind never sees "grid-cols-4" or "grid-cols-6" as literals
const cols = difficulty === "hard" ? 6 : 4;
return <div className={`grid-cols-${cols}`}>
```

This silently fails — the style is missing and no error is thrown.

### Right Approach

```typescript
// All possible values are visible to Tailwind's scanner
const GRID_COLS = {
  easy:   "grid-cols-4",
  medium: "grid-cols-4",
  hard:   "grid-cols-6",
};

return <div className={`grid ${GRID_COLS[difficulty]}`}>
```

Every class name is a complete literal string. Tailwind finds them all.

### Variant Props Pattern

When a component needs to look different based on context, a `variant` or `size` prop with a lookup map is the standard Tailwind pattern:

```typescript
const SIZE_CLASSES = {
  md: "w-16 h-16 text-2xl",
  sm: "w-12 h-12 text-xl",
};

function Card({ size = "md" }) {
  return <button className={SIZE_CLASSES[size]}>...</button>;
}
```

This pattern appears constantly in real-world React component libraries.

---

---

## Phase 4 — useRef and Functional State Updates

### useRef

`useRef` creates a container that holds a value across renders. Unlike `useState`, changing a ref does **not** trigger a re-render.

```typescript
const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

You read and write the value via `.current`:

```typescript
flipTimeoutRef.current = setTimeout(() => { ... }, 1000);
clearTimeout(flipTimeoutRef.current);
```

**When to use `useRef` instead of `useState`:**
- You need to hold a value (timeout ID, DOM element, previous value)
- Changing that value does not need to update the screen
- You need it to persist between renders

### Functional State Updates

When your new state depends on the previous state, always use the function form:

```typescript
// WRONG — may read stale state if React batches updates
setGameState({ ...gameState, moves: gameState.moves + 1 });

// RIGHT — `prev` is always the most recent committed state
setGameState((prev) => ({ ...prev, moves: prev.moves + 1 }));
```

React can batch multiple `setState` calls together. When that happens, the value of `gameState` captured in the closure may be one or more updates behind. The functional form `prev => ...` always gets the freshest value.

### Board Lock Pattern

The flip lock is a simple guard at the top of the handler:

```typescript
if (flippedCardIds.length === 2) return;
```

This is called "early return" or "guard clause." Instead of wrapping the entire function in an `if`, you bail out immediately when the condition isn't met. The remaining code is less indented and easier to read.

### setTimeout and Cleanup

`setTimeout` schedules a function to run after a delay. It returns an ID you can use to cancel it:

```typescript
const id = setTimeout(() => { ... }, 1000);
clearTimeout(id); // cancels before it fires
```

In this game, the flip-back delay must be cancelled when the player starts a new game — otherwise the old timeout fires on the new board and flips cards that shouldn't be flipped.

---

---

## Phase 5 — Derived State

### What Is Derived State?

Derived state is any value that can be computed from existing state. It does not need to be stored with `useState`.

```typescript
// Stored state (source of truth)
const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);

// Derived state — computed, not stored
const isLocked = flippedCardIds.length === 2;
const totalPairs = DIFFICULTY_CONFIG[difficulty].totalCards / 2;
const matchPercentage = (matches / totalPairs) * 100;
```

All three derived values are always correct because they are recomputed on every render from the data that drives them.

### Why Storing Derived State Is Dangerous

```typescript
// BAD — two sources of truth that can fall out of sync
const [flippedCardIds, setFlippedCardIds] = useState([]);
const [isLocked, setIsLocked] = useState(false);

// You must now remember to call setIsLocked in every place
// that changes flippedCardIds — miss one and the UI is wrong
```

A core React principle: **derive what you can, store only what you must.**

### Single Source of Truth for Logic

The `isInteractable` pattern in `Card.tsx` is worth studying:

```typescript
const isInteractable = !isMatched && !isFlipped && !isLocked;

return (
  <button
    disabled={!isInteractable}          // controls browser behaviour
    className={isLocked ? "dimmed" : "hoverable"}  // controls appearance
  >
```

Rather than duplicating the condition in two places, it's derived once at the top and used everywhere. Changing the rule only requires changing one line.

---

---

## Phase 6 — Conditional Rendering and Component Composition

### Conditional Rendering

In React, you can render components conditionally using the `&&` operator:

```tsx
{isComplete && <GameComplete ... />}
```

This works because:
- If `isComplete` is `false`, the expression short-circuits and renders nothing
- If `isComplete` is `true`, it evaluates the right side and renders the component

It is equivalent to:
```tsx
{isComplete ? <GameComplete ... /> : null}
```

Use `&&` when you only need the "true" branch. Use `? :` when you need both branches.

### CSS Position: Fixed

`position: fixed` (Tailwind: `fixed`) removes an element from the normal document flow and positions it relative to the **viewport** — the visible browser window — not its parent element.

Combined with `inset-0` (which sets `top: 0; right: 0; bottom: 0; left: 0`), it creates a full-screen overlay that covers everything:

```tsx
<div className="fixed inset-0 bg-black/70">
  {/* This covers the entire screen */}
</div>
```

`z-50` puts it on top of everything else in the stacking order.

### Component Composition

`GameComplete` receives all its data as props and has no internal state. It is a "dumb" or "presentational" component:

```tsx
// GameComplete knows nothing about the game
// It just displays what it receives and calls what it's given
<GameComplete
  moves={moves}
  elapsedTime={elapsedTime}
  onPlayAgain={handleRestart}
/>
```

This separation makes `GameComplete` easy to:
- Restyle without touching game logic
- Test in isolation
- Reuse in a different context (e.g., a "preview" mode)

The pattern: **smart parents pass data down; dumb children display it and report events up.**

---

---

## Phase 7 — useEffect and setInterval

### useEffect

`useEffect` lets you run code *after* React renders. It's for side effects — things that reach outside React's world:

- Starting a timer
- Reading from Local Storage
- Subscribing to an event
- Fetching data

```typescript
useEffect(() => {
  // Runs after render when dependencies change
}, [dependency1, dependency2]);
```

**Dependency array rules:**
- `[]` — runs once after the first render only
- `[a, b]` — runs after any render where `a` or `b` changed
- No array — runs after every render (rarely what you want)

### Cleanup Function

The function you return from `useEffect` is the cleanup. React calls it before the next run of the effect, and when the component unmounts.

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // tick
  }, 1000);

  return () => clearInterval(interval); // cleanup
}, [startTime]);
```

Without cleanup, every time `startTime` changes a new interval starts — but the old one keeps running. After 10 changes you'd have 10 parallel timers all writing to state.

**Rule:** if you start something in an effect, stop it in the cleanup.

### setInterval vs setTimeout

| | `setInterval` | `setTimeout` |
|---|---|---|
| Fires | Repeatedly, every N ms | Once, after N ms |
| Cleanup | `clearInterval(id)` | `clearTimeout(id)` |
| Use for | Timers, polling | Delays, flip-back |

In this game: `setInterval` drives the clock. `setTimeout` drives the flip-back delay. Both return an ID you should store and clear on cleanup.

### Why Compute From Origin

```typescript
// DRIFTS — setInterval is not perfectly precise
elapsedTime += 1;

// ACCURATE — always computes from the fixed start point
elapsedTime = Math.floor((Date.now() - startTime) / 1000);
```

If `setInterval` fires 50ms late every tick, the increment approach adds ~3 seconds of error per hour. The origin-compute approach stays exact because `Date.now()` always reads the real clock.

---

---

## Phase 8 — null as Intentional Absence

### null vs 0

`null` and `0` are both "empty-looking" but they mean different things:

| Value | Meaning |
|---|---|
| `score = 0` | The game was played and the score is zero |
| `score = null` | The game has not been completed yet |

Using `null` makes the distinction explicit and TypeScript enforces it. If you try to display `score` without checking for null first, TypeScript gives a type error — it won't let you treat "not set yet" the same as a real number.

```typescript
// TypeScript error: score might be null
<p>{gameState.score.toLocaleString()}</p>

// Correct: check first
{gameState.score !== null && (
  <p>{gameState.score.toLocaleString()}</p>
)}
```

This pattern — using `null` to represent "intentionally absent" — is one of the most common and useful TypeScript idioms.

### Pure Functions for Business Logic

`calculateScore` is a pure function in `gameLogic.ts`:

```typescript
export function calculateScore(
  moves: number,
  elapsedTime: number,
  difficulty: Difficulty,
  totalPairs: number
): number { ... }
```

It takes inputs, returns an output, touches nothing else. Benefits:

- **Testable:** call it with known inputs, check the output — no setup needed
- **Predictable:** same inputs always produce the same output
- **Moveable:** could be used in a server, a test, or a different UI without changes

The rule: if it's a calculation, it belongs in `lib/`, not in a hook or component.

---

*More concepts will be added as each phase is implemented.*
