---
title: Frontend
description: Atomic design, routing and state in the React app.
---

```
frontend/src/
  components/atoms/       smallest building blocks, including shadcn components
  components/molecules/   compositions of atoms
  components/organisms/   larger sections built from molecules and atoms
  components/templates/   page layouts without data
  pages/                  templates filled with data
  routes/                 TanStack Router file-based routes
  stores/                 zustand stores
  services/               everything that talks to the API
  lib/queries/            hooks that read data
  lib/mutations/          hooks that change data
  lib/                    query client and small helpers
  test/                   all tests, mirroring the src layout, plus render-app.tsx
  config.ts               where the API lives
```

## Atomic design

Each level only composes the levels below it. An organism may use molecules and atoms but never another organism's internals. Templates arrange organisms without knowing where data comes from, and pages supply that data.

shadcn is configured to generate into `components/atoms`. Plain Tailwind is preferred, so add a shadcn component only when it saves real effort.

## Responsive

The app should work well on every screen size, from phones to large desktops. Use Tailwind's breakpoints (`sm:`, `md:`, `lg:`, `xl:`) to adapt layouts, and check each page at a few widths so nothing breaks or scrolls sideways.

## App shell

Pages get their layout from a pathless layout route:

- `routes/_app.tsx` wraps pages in `AppLayout` (`components/templates/app-layout.tsx`): the `Navbar` on top and the page below. The navbar shows the logo, the nav links and the user menu. On phones the links move into a slide-out menu. Settings and every signed-in page live under `routes/_app/`.
- `routes/_app/_authenticated.tsx` sends signed-out visitors to `/login`. Put any page that needs a signed-in user under `routes/_app/_authenticated/`.
- `routes/_auth.tsx` wraps the login and sign-up pages in `AuthLayout`. It has no navbar. Small AVL trees grow and shrink in a faint background behind the form (`organisms/avl-background.tsx`), and they stay still when the visitor prefers reduced motion. Signed-in visitors are sent to `/`.

Unknown URLs show `NotFoundPage` inside `AppLayout`.

The user menu shows the signed-in user's name and email, with Settings and Sign out. If signing out fails, the menu stays open and shows why.

The background imports its AVL rules (`insertKey`, `removeKey`, `layoutTree`) from `@shared/avl`, the same copy the backend uses. Each tree is a `GrowingAvlTree` molecule drawn from two atoms, `TreeNodeCircle` and `TreeEdge`. Phones show one tree, tablets two and desktops three. Trees for bigger screens are only mounted at that size, so phones don't animate trees nobody can see.

## Colour schemes

Learners can pick a colour scheme on the Settings page (`/settings`):

- **Default**: the standard teal, pink and lime.
- **High contrast**: black and white with bright fills, for low vision.
- **Colour-blind friendly**: the Okabe-Ito palette, which stays distinct for every common kind of colour blindness.

Each scheme is a block of CSS variables in `src/index.css`, with a light and a dark version. The chosen scheme is set as `data-colour-scheme` on `<html>`, and the variables change with it. The choice is saved in the browser by `stores/colour-scheme-store.ts`.

This only works if components use theme colours (`bg-primary`, `text-muted-foreground`) and never raw colour values. When you add a new colour variable, add it to every scheme block.

Colour is never the only signal. States also need an icon, shape or label, so they still read in any scheme.

## Routing

Routes live in `src/routes` and are discovered by the TanStack Router Vite plugin, which generates `routeTree.gen.ts`. A route file stays thin and renders a page from `src/pages`.

The root route loads the session in `beforeLoad` with `queryClient.fetchQuery(sessionQueryOptions)` and puts it in the router context, where `_app/_authenticated.tsx` and `_auth.tsx` read it. `fetchQuery` asks the server again whenever the cached session is stale, which is after 60 seconds or straight after sign-in, sign-up or sign-out. If the session request fails, `beforeLoad` throws a `SessionLoadError`. The root's `RootErrorPage` shows `SessionErrorPage` for that error, which says the server can't be reached and has a Try again button. It doesn't treat the user as signed out. Any other error from a page shows `ErrorPage` inside `AppLayout`, so the navbar stays.

## Services

Every API call lives in `src/services`. Components never call axios themselves.

Each feature gets its own folder:

```
services/tree-service/
  tree.urls.ts          the endpoints
  tree.service.ts       the functions that call them
  index.ts              exports
```

A service function looks like this:

```ts
export const getHealth = async (): Promise<Health> => {
  const { data } = await networkService
    .get(uris.healthUri)
    .catch((error) => rejectAxios(error, "Unable to reach the server"));

  const parsedData = healthSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};
```

If the request fails, `rejectAxios` turns it into a `ServiceError` with a status and message. If the response looks wrong, `rejectInvalidResponse` does the same. Either way the UI gets one kind of error to handle.

To add a service, copy `health-service`, rename it, and export it from `services/index.ts`.

`auth-service` is the one service that doesn't use `networkService`. It calls Better Auth's `authClient` instead, but follows the same rules: failures become a `ServiceError`, and the session is checked with `sessionResponseSchema` from `@shared/schemas` before anything uses it.

## Code trace

The code trace shows the code that is running next to the tree, like a debugger. It's built from props only, so a lesson or the playground can drive it with any list of steps.

- `TraceLayout` (`organisms/trace-layout.tsx`) puts the tree and the code side by side from `md` up. Below that, Tree and Code tabs switch between them. The message and the step controls sit under both, so they show on either tab.
- `CodeTrace` (`organisms/code-trace.tsx`) takes one step: `stepKey`, `variables` and `callStack`, picked from a `Step`. It shows the snippet for the step's algorithm (`algorithmOf(stepKey)`, so `rotate-right.lift-pivot` shows the `rotate-right` snippet), the variables and the call stack, plus the language dropdown. The step player passes `steps[index]`, and `steps[index - 1].variables` as `previousVariables` so changed values get a dot.
- The running line has a lime band and a dot in the gutter, and `aria-current="step"`. The band slides between lines, and jumps with reduced motion. Long lines scroll inside the code box, never the page.
- The code box is always 11 lines tall, and the variables list always has room for 4 rows. Without that, the page jumps every time a step moves into a shorter function, like `updateHeight`.
- `StepMessage` (`molecules/step-message.tsx`) shows the step's sentence and "Step n of m". The Listen button only shows when you pass `onListen`, so the page decides how to read it out.
- Snippets come from `useAlgorithmSnippetsQuery(codes, language)` in `lib/queries/algorithm.queries.ts`, one query per algorithm, because one insert runs several. Leave out the language to get the learner's. A missing snippet (404) isn't retried. `lib/code-languages.ts` lists the three languages, how each names functions (`updateHeight` or `update_height`) and how it writes an empty value (`empty`, `null` or `None`).

## Step player

The step player moves through a list of steps: one at a time, on its own, or straight to any step.

- `useStepPlayer(steps, runKey)` (`lib/use-step-player.ts`) holds the current index and whether it's playing. Each call keeps its own state, so a lesson page can have several players. It indexes into the engine's snapshots, so stepping back shows exactly the earlier step. Play stops on the last step, and pressing play on the last step starts again from the first. `runKey` is a string that names the run, like `insert:20,10,#,#,#:5`. A new `runKey` goes back to the first step and pauses. The `steps` array itself can be new on every render, so building it inline with `.map()` is fine. If the same run comes back with fewer steps, the player moves to the last one.
- The speed (0.5×, 1× or 2×) lives in `stores/playback-store.ts` and is saved as a preference. Each step lasts one second divided by the speed.
- `StepControls` (`molecules/step-controls.tsx`) takes the hook's result as `player`, and one phase per step as `phases`. It shows a dot for every step. Tapping a dot jumps to that step. The current dot has a ring and a pin above it that reads "4 of 12". Only the current dot is in the Tab order, and the arrow keys move focus along the dots with the step. Under the dots are a key, the first, back, play, forward and last buttons, and the speed picker. On phones every dot is 44px wide, and the line scrolls to keep the current dot in the middle.
- `lib/step-phases.ts` puts each step in a phase by its algorithm: walking the tree (insert, delete, search and the traversals), update height, rebalance, or rotate. Each phase has a colour (`bg-phase-*`, in every scheme block in `index.css`) and a shape: circle, square, diamond or triangle. The shape means the line never relies on colour alone. Dots are always full colour, because a faded dot is too pale to see in the light schemes. Only the line after the current dot is faded.
- Keys only work inside the player, because the hook's `handleKeyDown` sits on the player, not on `document`. Space plays and pauses, the arrow keys step, and Home and End jump to the ends. Keys from inputs, radios and tabs are left alone, so the Tree and Code tabs don't move the player too. The end buttons use `aria-disabled`, not `disabled`, so they keep focus at the first and last step and the keys keep working. Holding Space doesn't flip play and pause over and over.

## Queries and mutations

Components don't call services directly. They use hooks from `lib/queries` and `lib/mutations`, one file per feature.

A query reads data:

```ts
export const healthQueryKeys = {
  all: ["health"] as const,
};

export const useHealthQuery = () =>
  useQuery({
    queryKey: healthQueryKeys.all,
    queryFn: healthService.getHealth,
  });
```

A mutation changes data, then tells the matching queries to refetch:

```ts
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user", "update"],
    mutationFn: userService.updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  });
};
```

Keep the query keys in the queries file and reuse them, so a typo can't break a refetch.

## State

- **Server state** belongs in TanStack Query, through the hooks above.
- **Client-only state** belongs in a Zustand store in `src/stores`, one store per concern.
- **Forms** use TanStack Form with zod schemas from `@shared/`.
- **Tables** use TanStack Table.

## Testing

All tests live in `src/test/`, at the same path as the code they cover. For example, the test for `src/pages/courses-page.tsx` is `src/test/pages/courses-page.test.tsx`.

Vitest runs two groups, set up in `frontend/vitest.config.ts`:

- **`*.test.ts`** runs in Node. Use it for services, hooks logic and plain functions. Mock `networkService` with `vi.mock`.
- **`*.test.tsx`** runs in a real Chromium with Vitest browser mode. Use it for components.

Component tests use `vitest-browser-react`:

```tsx
import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows the courses empty state", async () => {
  const screen = await renderApp("/courses");

  await expect.element(screen.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
});
```

`renderApp(path)` in `src/test/render-app.tsx` renders the whole app at that path, so links and the navbar work. For a component that doesn't need the router, use `render` from `vitest-browser-react` directly.

Because it's a real browser, layout works. You can measure SVG nodes and check where things end up on screen.

Download Chromium once with `bun run test:install-browsers` in `frontend/`.
