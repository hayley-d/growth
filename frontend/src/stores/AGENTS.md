# Stores

Zustand stores for client-only state: things the server doesn't know about, like which tree is selected, animation speed, or whether a menu is open.

## Rules

- One store per concern, one file each: `<concern>-store.ts` exporting `use<Concern>Store`.
- Never put server data here. Anything fetched from the API lives in TanStack Query (`lib/queries`). Don't copy it into a store.
- Keep state and the actions that change it in the same store. Name actions as verbs: `selectTree`, `setSpeed`, `reset`.
- Components read with a selector so they only re-render when that value changes: `useTreeStore((state) => state.selectedTree)`.
- Only use the `persist` middleware for real user preferences, and give it a unique `name`.

## Tests

Test stores in `<concern>-store.test.ts` (runs in Node). Call actions through `use<Concern>Store.getState()` and reset the store in `beforeEach`.

Keep this file current: update it in the same commit when you add a store pattern or middleware.
