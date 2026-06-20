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

*More concepts will be added as each phase is implemented.*
