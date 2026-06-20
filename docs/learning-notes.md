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

*More concepts will be added as each phase is implemented.*
