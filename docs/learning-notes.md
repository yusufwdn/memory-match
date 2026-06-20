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

---

## Phase 9 — Local Storage

### What Is Local Storage?

Local Storage is a key-value store built into every browser. Think of it like a small USB drive that lives inside the browser: data written there survives page refreshes and browser restarts, but is isolated to one browser on one machine.

```javascript
// Write
localStorage.setItem("my-key", "hello");

// Read
const value = localStorage.getItem("my-key"); // "hello"

// Delete
localStorage.removeItem("my-key");
```

Everything stored is a **string**. To store objects or numbers, you convert them with `JSON.stringify` on the way in and `JSON.parse` on the way out.

### Why Local Storage Can Fail

Local Storage is not always available:

| Situation | Why it fails |
|---|---|
| Server-Side Rendering (SSR) | The server has no `window` object — `localStorage` doesn't exist |
| Private/incognito mode | Some browsers block or limit storage |
| Storage quota exceeded | Browsers cap it at ~5MB; writes beyond that throw |

This is why the `storage.ts` module wraps every call in a `try/catch` and checks `typeof window !== "undefined"` before touching the API. The game stays fully functional even if storage is unavailable — it just won't remember scores.

### Lazy Initializer With Side Effects

```typescript
const [difficulty, setDifficulty] = useState<Difficulty>(
  () => getLastDifficulty() ?? "easy"
);
```

Passing a **function** to `useState` is called a lazy initializer. React calls it once, on the first render only.

This is the right place to call `getLastDifficulty()` — it reads Local Storage once at startup, not on every render.

If you wrote `useState(getLastDifficulty() ?? "easy")` without the arrow function, `getLastDifficulty()` would be called on **every render** even though React only uses the result on the first one. The function form opts out of that waste.

### Optimistic State Update

When the player beats their best score, two things happen:

1. `saveBestScoreIfBeaten()` writes to Local Storage immediately
2. `setBestScores(getBestScores())` reads it back and updates React state

The UI doesn't wait — it updates the screen right away. This pattern is called an **optimistic update**: we assume the write succeeded and update the UI immediately. If it failed (storage unavailable), we read back null, which is no worse than before.

### Derived `previousBest` in the Component

`GameComplete` receives `previousBest` and `isNewBest` as separate props:

```tsx
previousBest={bestScores[difficulty]}
isNewBest={isNewBest}
```

This separation lets `GameComplete` handle three cases cleanly:
1. **No previous record:** don't show a comparison line
2. **Previous record, not beaten:** show "Best: 750"
3. **New record set:** show "New Best!" badge instead

The logic stays in the component because it is display logic — which text and which colour to show. It is not game logic.

---

---

## Phase 10 — Animation and Framer Motion

### Why Animate?

Animation does two things beyond looking nice:
1. **Communicates state changes** — a flip shows the player something happened; without it, the card just changes color, which is easy to miss
2. **Feels physical** — humans understand the world through motion; a card that rotates feels like a real object

### The 3D Flip Illusion

The flip animation uses a three-layer structure:

```
<div style="perspective: 1000px">           ← Layer 1: sets up the 3D space
  <motion.div style="transformStyle: preserve-3d"  ← Layer 2: rotates 0°↔180°
    animate={{ rotateY: isFlipped ? 180 : 0 }}
  >
    <div style="backfaceVisibility: hidden" />     ← Layer 3a: back face ("?")
    <div style="backfaceVisibility: hidden"        ← Layer 3b: front face (symbol)
         style="rotateY: 180" />                       pre-rotated 180°
  </motion.div>
</div>
```

**`perspective`:** Creates the 3D depth effect. Lower values (400px) look dramatic; higher values (1200px) look subtle. 1000px is a natural middle ground.

**`transformStyle: preserve-3d`:** Without this, the browser flattens all children into a 2D plane — the 3D trick breaks entirely.

**`backfaceVisibility: hidden`:** Each face is hidden when it is pointing away from the viewer. This is what creates the swap — one face disappears, then the other appears.

**Pre-rotating the front face 180°:** The front face starts facing backward (hidden). When the container rotates to 180°, the front face's own 180° + the container's 180° = 360° = facing forward.

### Spring Physics

Framer Motion's `type: "spring"` gives animations physical weight:

```typescript
transition: {
  type: "spring",
  stiffness: 260,  // how fast it moves (higher = faster)
  damping: 20,     // how much it slows down (lower = more bounce)
}
```

Compare the feel:
- **`stiffness: 400, damping: 40`** — snappy, no bounce
- **`stiffness: 260, damping: 20`** — brisk, slight overshoot (used for card flip)
- **`stiffness: 100, damping: 10`** — slow and bouncy (too much for UI)

The slight overshoot on the card flip makes it feel like a real card thrown down on a table — not a computer animation.

### `animate` as a Declarative Description

In Framer Motion you describe **what state something should be in**, not **how to get there**:

```typescript
// Declarative — Framer Motion figures out the animation
<motion.div animate={{ rotateY: isFlipped ? 180 : 0 }}>

// Not imperative — you don't write "start at 0, add 1 per frame until 180"
```

When `isFlipped` changes from `false` to `true`, Framer Motion automatically animates the value from its current position (0) to the target (180). When it changes back, it animates in reverse.

### The Matched Pop

When a pair is found, the front face briefly scales up and back:

```typescript
animate={isMatched ? { scale: [1, 1.12, 1] } : { scale: 1 }}
```

Passing an **array** to `animate` creates a keyframe sequence — Framer Motion moves through each value in order. `[1, 1.12, 1]` means: stay at normal size, grow 12%, return to normal. The whole thing takes ~200ms. It draws the player's eye to the matched pair without being distracting.

---

## Phase 11 — Modal State Pattern

### Where to Put UI State

`isSelectingDifficulty` controls whether the modal is open. It lives in `page.tsx` — not in `useGameState`.

Why? Because it is **UI state**, not **game state**. The game itself doesn't care whether a modal is on screen. If the player closes the modal without choosing, nothing about the game changes.

The rule: **only put state in the hook if the game logic needs it.** Pure display decisions (is this panel open? is this tooltip visible?) belong in the component that renders them.

### `aria-pressed` for Toggle Buttons

```tsx
<button aria-pressed={isActive}>Easy</button>
```

`aria-pressed` tells screen readers that this button is a toggle — it has an "on" and "off" state. Screen readers will announce "Easy button, pressed" or "Easy button, not pressed", which communicates the current selection without requiring visual inspection.

### `stopPropagation` for Nested Clicks

The difficulty modal has two clickable layers:
- The backdrop (clicking it closes the modal)
- The modal card itself (clicking it does nothing to the modal)

Without `stopPropagation`, clicking anywhere inside the modal would also trigger the backdrop's `onClick`:

```tsx
// Backdrop closes on click
<div onClick={onClose}>

  {/* Without stopPropagation, clicking here also triggers onClose */}
  <div onClick={(e) => e.stopPropagation()}>
    {/* Modal content */}
  </div>

</div>
```

`e.stopPropagation()` stops the click event from "bubbling up" to parent elements.

---

## Phase 12 — Accessibility and Stagger Animation

### What Is Accessibility?

Accessibility means the application works for people who navigate differently — using a keyboard instead of a mouse, or a screen reader instead of a monitor.

In React, accessibility is mostly about two things:
1. **Semantic HTML** — using the right elements (`button`, `role="grid"`) so browsers know what each thing is
2. **ARIA attributes** — extra labels that describe state screen readers can't infer visually

### `aria-live` for Dynamic Content

```tsx
<p aria-live="polite" aria-atomic="true">{moves}</p>
```

`aria-live="polite"` tells screen readers: "when this content changes, announce it the next time the user pauses." Without it, a screen reader user would never hear move count updates.

`aria-atomic="true"` means announce the whole element, not just the changed part. For a number, this doesn't matter much — but for `"3 / 6 pairs matched"` it prevents the screen reader from saying only "3" instead of the full label.

### Keyboard Support on Cards

```tsx
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onClick();
  }
}}
tabIndex={isInteractable ? 0 : -1}
```

- `tabIndex={0}` puts the card in the keyboard tab order — the player can reach it with Tab
- `tabIndex={-1}` removes non-interactable cards from the tab order — matched and locked cards are skipped
- `e.preventDefault()` on Space prevents the page from scrolling (the default browser behaviour for Space)

### Framer Motion Variants and Stagger

Variants are named animation presets shared between parent and children:

```typescript
// Parent — controls timing
const boardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

// Child — controls what each item does
const cardVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  show:   { opacity: 1, scale: 1 },
};
```

When the parent animates to "show", Framer Motion automatically propagates the variant name to all children — but delays each one by `staggerChildren` seconds. The 4th card starts 120ms after the 1st, creating a cascade without any manual delay calculation.

The Board receives a `key` prop that changes on every new game. When React sees a new `key`, it unmounts and remounts the component — the entrance animation replays from scratch on every reset.

---

*All 12 phases complete.*
