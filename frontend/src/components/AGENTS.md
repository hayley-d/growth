# Components

Atomic design. Pick the level by what a component is made of, not by how big it looks.

| Folder | What goes here | Example |
| --- | --- | --- |
| `atoms/` | One element with no other components inside. All shadcn components. | button, input, badge, tree node circle |
| `molecules/` | A few atoms working together. | labelled input, nav links, search box |
| `organisms/` | A whole section of a page, built from molecules and atoms. | navbar, tree canvas with controls, lesson list |
| `templates/` | A page layout with slots for content and no data. | app layout with navbar and outlet |

Rules:

- A level only imports from levels below it. An atom never imports a molecule.
- Components get data through props. They never call services or query hooks, and never read the URL. Pages do that.
- A component may read a Zustand store for client-only UI state.
- One component per file. File names are kebab case (`tree-canvas.tsx`), component names are PascalCase (`TreeCanvas`).
- Use named function exports and destructure props: `export function TreeCanvas({ nodes, className }: TreeCanvasProperties)`. Name the props type `<Component>Properties`, never `Props`. Accept a `className` and merge it with `cn` when callers may need to adjust layout.

<important if="adding a shadcn component">
Use the shadcn CLI with bunx. `frontend/components.json` points the `ui` alias at `@/components/atoms`, so it lands in `atoms/`. Don't move it. The generated code may break the house rules (short names like `props`, relative imports); fix it and run `bun run check` before you commit.
</important>

## Styling and accessibility

- Mobile first, at least 44px touch targets (`min-h-11` or `size-11`). See `frontend/AGENTS.md`.
- Use real elements: `button` for actions, `a` (via the router's `Link`) for navigation, headings in order.
- Anything that only shows an icon needs an `aria-label`.
- Respect reduced motion for animations (`motion-reduce:` variants).

## Tests

Test a component in `<name>.test.tsx` next to it. It runs in Chromium. Query by role and accessible name.

Keep this file current: update it in the same commit when you add a component pattern, a shared building block or a new rule for a level.
