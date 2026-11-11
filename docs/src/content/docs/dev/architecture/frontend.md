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
- `routes/_app.tsx` also checks onboarding. A signed-in learner whose profile says `onboardingComplete: false` is sent to `/onboarding` from every page in the app shell, settings and the playground included. It reads the profile with `queryClient.fetchQuery(meQueryOptions)`. If that request fails, the error page shows, and the learner isn't treated as "not onboarded".
- `routes/onboarding.tsx` sits outside `_app`, in `SetupLayout` (`components/templates/setup-layout.tsx`): the logo and the user menu with only Profile and Sign out, and no nav links. Signed-out visitors go to `/login` and onboarded learners go to `/`, unless the URL has `?retake=true`.
- `routes/_auth.tsx` wraps the login and sign-up pages in `AuthLayout`. It has no navbar. Small AVL trees grow and shrink in a faint background behind the form (`organisms/avl-background.tsx`), and they stay still when the visitor prefers reduced motion. Signed-in visitors are sent to `/`.

Unknown URLs show `NotFoundPage` inside `AppLayout`.

The user menu shows the signed-in user's name and email, with Settings and Sign out. If signing out fails, the menu stays open and shows why.

The background imports its AVL rules (`insertKey`, `removeKey`, `layoutTree`) from `@shared/avl`, the same copy the backend uses. Each tree is a `GrowingAvlTree` molecule drawn from two atoms, `TreeNodeCircle` and `TreeEdge`. Phones show one tree, tablets two and desktops three. Trees for bigger screens are only mounted at that size, so phones don't animate trees nobody can see.

## Onboarding

`OnboardingPage` (`pages/onboarding-page.tsx`) runs four steps: the learning style quiz, the code language, the leaderboard and text to speech. The answers live in `stores/onboarding-store.ts` until the last step, which sends them all with `POST /api/onboarding`. The store resets when the page unmounts, so a learner who leaves halfway starts again.

- `LearningStyleQuiz` (`organisms/learning-style-quiz.tsx`) shows one question at a time with `ProgressHeader` (label, bar and Back). A tap moves on, Back keeps the answer, and after the last question it hands every answer to the page.
- The page sends them to `POST /api/onboarding/quiz` and shows `LearningStyleResult` (`organisms/learning-style-result.tsx`), which names the style and lets the learner pick any of the four. Both organisms use `ChoiceButton` (`molecules/choice-button.tsx`), which marks a picked answer with a tick and `aria-pressed`, not colour alone.
- On success the `me` query is set and invalidated, so the guard sees the change, and the learner goes to `/`.
- `/onboarding?retake=true` is for learners who are already set up. It only runs the quiz, saves the style with `PATCH /api/me/profile`, has a Cancel link, and goes back to `/settings`. The "Retake the quiz" link in Settings opens it.

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

## Playground

The playground is two pages. `/playground` is a setup form and `/playground/play` is the playground itself. The setup lives in the search params, so a reload keeps the same tree and "Change setup" goes back with the answers filled in.

- The setup form asks one question at a time: the topic (tree building or traversals), which traversal (traversals only), how to explore (watch it run, or interact with the tree), and the starting tree (5 random keys, 12 random keys, or empty). Next to it, a preview tree changes with each answer.
- `/playground/play` with a half-filled setup sends the learner back to the form.
- The logic is plain functions in `lib/playground/`, tested in Node. `commands.ts` reads a command and blocks anything outside the setup. `run-command.ts` runs it with the traced engine, or with `insertBst` and `removeBst` when auto-balance is off. `drop-rules.ts` lays out the empty spots (their key ranges come from `openSpots` in `@shared/avl`), and `dropToAction` turns a drop into a reducer action. `playground-reducer.ts` holds the session: the tree, the current run, the log and the walk prediction. Buttons and drags send a typed `run` action, and the reducer still sends it through `parseCommand`, so the setup check covers every route. `usePlaygroundSnippets` loads the code for the panel.
- Each run gets its own id from the reducer, which the page passes to `useStepPlayer` as its `runKey`.
- Drag and drop uses pointer events in `usePointerDrag`. The drop target is found with `elementFromPoint` and `data-drop` attributes. The hook only re-renders when the drag starts moving or its target changes. In between it moves the ghost through `ghostRef`. `TreeView` takes `slots` to draw the dashed drop spots, and nodes in manual mode carry `data-node-key`. Every drag also has a button or click route, so keyboard users can do the same things.
- `TreeView` takes the `NodeState` from `@shared/avl`, the same type trace steps use, so step states go straight in. `TreeNode` reads `deleting` out as "about to be deleted".
- Edges have no state: every edge is drawn the same colour. Visited nodes look the same as untouched ones. The current node is filled with the primary colour and has a pointer above it. During a rebalance, the unbalanced node is filled with the warning colour and shows its balance factor, and the other rotation nodes are filled with the yellow accent colour. The step player's rebalance and rotate dots use matching yellows.
- In "Watch it run" the tree always balances itself, so the console refuses `rotate` and `balance` and doesn't suggest them. They only work in "Interact with the tree".
- "Hide code" sets `TraceLayout`'s `codeHidden`, which hides the code panel and the phone tabs without swapping any elements, so the tree gets the whole card.
- Messages and errors (`PlaygroundNotice`) sit at the top of the tree box. The tree is in `TreeViewport`, a box of fixed height that scrolls. `ZoomControls` floats in its top-right corner: a small pill that zooms from 50% to 400% in steps, with a reset button back to 100%. Its buttons use the accent colour, and are 44px on touch screens but smaller with a mouse (`pointer-fine:`). With a mouse you can drag empty space in the box to pan. A drag that starts on a node, drop spot or button doesn't pan, so moving nodes still works. Touch uses the browser's own scrolling. The delete bin (`DropBin`) is a round icon that always sits in the new-key row, after the drag chip. It gets a border while a node is dragged and opens when the node is over it. Short help sits behind `InfoTip` icons, which open on hover, focus or tap.
- Listen reads the step message aloud with `speak` from `lib/speak.ts` (the browser's speech synthesis).
- The new-key box only takes two digits, since keys are 1 to 99.

## Copy tree

`CopyTree` (`organisms/copy-tree.tsx`) draws a lesson's `copy_tree` block. It takes the block's `startingKeys` and `caption`. `LessonBlock` renders it on the lesson page.

- The original tree is on one side and the copy on the other, side by side from `sm` up and stacked below that. Each press of Step copies the next node in pre-order.
- In the original, the node being copied is `active` and the ones already copied are `visited`. In the copy, the node that just went in is `new`.
- A sentence above the trees says what happened, like "Copy 4 under 8.", and the copy order so far is listed under them.
- `lib/copy-tree-steps.ts` builds the steps. The first step has nothing copied, and each one after it adds one node with the parent it hangs under. `trimTree` cuts the original down to the copied keys.
- The copy is drawn with `TreeView`'s `layoutRoot` set to the original, so every copied node sits where it is in the original and the box doesn't change size as the copy grows. Without it the copy would be laid out as its own tree and its nodes would jump around.
- It steps with `useStepPlayer`, so the arrow keys, Home and End work the same as in the code trace. The Reset, Back and Step buttons come from `StepButtons` (`molecules/step-buttons.tsx`), which uses `aria-disabled` at the ends, like `StepControls`.

## Expression tree

`ExpressionTree` (`organisms/expression-tree.tsx`) draws a lesson's `expression_tree` block. It takes the block's `expression`, `order` and `caption`. `LessonBlock` renders it on the lesson page.

- The tree is built straight from the expression's shape in `lib/expression-tree-steps.ts`, never by inserting keys, because inserting would sort the nodes into a search tree and lose the shape. Each node gets a made-up number key, and `TreeView`'s `nodeLabels` shows its operator or value instead of the number.
- Each press of Step visits the next node in the block's order. The visited node is `active` and the earlier ones are `visited`. What's been written so far is listed under the tree, and the last step names the notation: prefix for pre-order, infix for in-order and postfix for post-order.
- It uses `useStepPlayer` and `StepButtons` like `CopyTree`.

## Delete tree

`DeleteTree` (`organisms/delete-tree.tsx`) draws a lesson's `delete_tree` block. It takes the block's `startingKeys` and `caption`. `LessonBlock` renders it on the lesson page.

- It's the copy tree in reverse. The whole tree shows at the start, and each press of Step deletes the next node in post-order. The node being deleted is `about to be deleted`, and the ones before it are gone.
- The sentence above the tree says why it's safe, like "Delete 4. 2 and 6 are already gone.", and the delete order so far is listed under it.
- `lib/delete-tree-steps.ts` builds the steps, each with the node's children. The tree is drawn with `trimTree` from `copy-tree-steps.ts` and `TreeView`'s `layoutRoot`, so the nodes left over don't move as others go.
- It uses `useStepPlayer` and `StepButtons` like `CopyTree`.

## Tree heights

`TreeHeights` (`organisms/tree-heights.tsx`) draws a lesson's `heights` block. It takes the block's `startingKeys` and `caption`. `LessonBlock` renders it on the lesson page.

- Each press of Step works out the next node's height, in post-order. The node is `active` and the ones already done are `visited`.
- The sentence above the tree shows the sum, like "4's left subtree has height 1 and its right subtree has height 1, so its height is 1 + max(1, 1) = 2." An empty child has height 0, so a leaf is 1. The heights so far are listed under the tree.
- `lib/tree-heights-steps.ts` builds the steps. The first step has no heights, and each one after it adds one node with its two subtree heights.
- It uses `useStepPlayer` and `StepButtons` like `CopyTree`.

## Traversal quiz

`TraversalQuiz` (`organisms/traversal-quiz.tsx`) draws a lesson's `traversal_quiz` block. It takes the block's `startingKeys` and `orders`. `LessonBlock` renders it on the lesson page.

- It shows the tree and one box per order. The learner types the keys in order, with commas or spaces between them, and presses Check.
- Each box gets its own feedback: correct, wrong, or a reminder to type keys when the answer isn't a list of numbers (`lib/traversal-answer.ts`). Each has an icon as well as a colour, and a screen reader hears the results.
- After a check with a wrong answer, Show answers lists the right order under each box.
- The answers come from `TreeTraversal` in `@shared/avl`, so they always match the tree.

## Lesson page

`/lessons/$lessonId` shows one lesson, one step at a time. The design is B+, the Glow bar. The map (`/learn`) starts the lesson before it opens the page, so the page itself doesn't call the start endpoint.

- The step is the `step` search param (`lib/lesson/lesson-search.ts`), so a refresh lands on the same step. `clampStep` keeps it between 1 and one past the last step. One past the last step is the end screen.
- The steps are the lesson's steps, plus "Explain it in your own words" at the end when the lesson has a `notePrompt`. That step is `LessonNoteStep`, which saves on its own. It's optional, so Finish never waits on it.
- `LessonLayout` (`templates/lesson-layout.tsx`) holds the header (close, unit, title), the progress bar, the sliding step column and the Back and Continue footer. The footer is fixed to the bottom of the screen, so it stays put while steps change height. The left and right arrow keys move between steps from anywhere on the page, unless the key came from a text box or a slider, or a block already handled it (`defaultPrevented`). The code trace and the step blocks call `preventDefault` on the arrows they use, so they don't move the lesson too.
- `LessonProgress` is a thin `role="progressbar"` with "Step N of M" as its value text. On Continue a soft light runs along it to the new end, then fades. There's no glow at rest, and none with reduced motion.
- `LessonStep` always shows the core block. Below it, if the learner has a style and the step has a block for it, that block shows under "Picked for you". If no block matches, `pickExtra` (`lib/lesson/pick-extra.ts`) shows the visual one instead, or the first one when there's no visual block, under "Another way to see it". Every other style block goes under a closed "Other ways to learn this" toggle. The order is: a screen-reader-only step heading, "What you'll learn" (first step only), the core block, the picked block, then the toggle. Each style block is labelled from `learningStyleId` and `useLearningStylesQuery`, like "For visual learners", with a Lucide icon. Listen reads the core and picked transcripts. It sits on the first line of text: beside "What you'll learn", else floated right in the core block's markdown (`aside` on `Markdown`, threaded through `LessonBlock`), else on its own row when the core block starts with no text.
- `LessonBlock` (`organisms/lesson-block.tsx`) is the one switch over the block `type`. Blocks with an optional `markdown` show it above the block. `number_line` has no real renderer yet, so it shows the tree and its caption.
- A 403 shows the locked state with "Take the test to skip ahead". A 404 says the lesson is gone. Neither is retried.

### Text and diagram blocks

- `Markdown` (`molecules/markdown.tsx`) renders with `react-markdown` and theme classes only. A `##` in content becomes an `h3`, since the step label is the `h2`.
- `DiagramBlock` draws the tree one level at a time with `TreeView`'s `layoutRoot`, so nodes don't move as levels arrive. Highlights land once the tree is drawn. With reduced motion the finished tree shows straight away. Diagrams turn off the pointer arrow, since nothing moves. The block's `transcript` is the description. With `labels`, the caption is screen-reader only and the tree's accessible name is the caption plus the label text. Without labels, the caption shows under the tree.
- Leader labels: `TreeView` takes `labels` and lays them out with `lib/lesson/tree-label-layout.ts`, ported from the storyboard. `right` gets a dotted leader and an end dot, `side` joins its nodes to a bracket, and `below` puts a bracket under its nodes. The viewBox grows to fit them. `TreeLabels` draws them in after the highlights land, one at a time: the bracket draws, the leader fades in, then the words type out. With reduced motion they show straight away.
- Word-to-node links: `TreeLinksProvider` (`lib/lesson/tree-links.tsx`) wraps only the core block and the picked or fallback block, so a word links to a tree only when the learner sees both straight away. Blocks under "Other ways" sit outside it, so their words stay plain. Trees register their keys with `useLinkedTree`. A bold word in `Markdown` becomes a `TermButton` only when its block's `terms` names it and a tree in the step shows all its keys. Otherwise it stays plain bold. Pointing at or focusing a word lights its nodes and any label on them. Tapping it pins it (`aria-pressed`). Pointing at a node lights the words that name it. Outside the provider everything is a no-op.
- Write-in and spoiler: a text block with `write` shows `WriteIn` (`molecules/write-in.tsx`), a labelled text area. What the learner types lives in `stores/writing-store.ts`, keyed by block id, so going back a step keeps it, but a reload clears it and nothing is sent to the server. A text block with `answer` shows it inside `Spoiler` (`molecules/spoiler.tsx`). It starts as an opaque bar, and clicking the bar or the Show answer button reveals it. While it's hidden the answer is `invisible`, `aria-hidden` and `inert`, so screen readers skip it too.

### Animation and playground blocks

These follow design C, Score and scrubber: the task is set large, and the tree is what you play it on.

- `AnimationBlock` builds its steps with `animationSteps` (`lib/lesson/animation-steps.ts`), one traced operation after another, and plays them with the same `StepControls` step player as the code trace.
- `PlaygroundBlock` has two modes. With `traverse` allowed, the learner taps nodes in order. `TraversalStaff` shows one numbered beat per node, and wrong taps are written small and crossed out above the beat they were meant for (`lib/lesson/traversal-taps.ts`). Otherwise it reuses the playground page's pieces: `playgroundReducer`, the notice, `TreeViewport`, the step player and `PlaygroundConsole`. The learner types commands like `insert 4`. Only the block's allowed operations run, and anything else gets a refusal that lists them. The suggestions offer the next `containsKeys` key that's missing. Start again remounts the session. A reached goal shows `GoalReached`, with an icon and a message, not just colour.
- `CodeTraceBlock` runs the block's operation on its starting tree and shows it in `TraceLayout` with `CodeTrace` and `StepControls`, like the playground. With `showCode` set to false it skips `TraceLayout` and puts the tree beside `CallStack`, with no code and no Tree and Code tabs.

### Listen

`ListenButton` reads the step's core and style transcripts in order with `speakAll` from `lib/speech.ts`. `stores/speech-store.ts` remembers which step is speaking, so the button can say Stop. Moving to another step, or leaving the page, stops it. The button is hidden when the browser can't speak. There's no auto-read setting yet.

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

All tests live in `src/test/`, at the same path as the code they cover. For example, the test for `src/pages/dashboard-page.tsx` is `src/test/pages/dashboard-page.test.tsx`.

Vitest runs two groups, set up in `frontend/vitest.config.ts`:

- **`*.test.ts`** runs in Node. Use it for services, hooks logic and plain functions. Mock `networkService` with `vi.mock`.
- **`*.test.tsx`** runs in a real Chromium with Vitest browser mode. Use it for components.

Component tests use `vitest-browser-react`:

```tsx
import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows the dashboard with empty states", async () => {
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});
```

`renderApp(path)` in `src/test/render-app.tsx` renders the whole app at that path, so links and the navbar work. For a component that doesn't need the router, use `render` from `vitest-browser-react` directly.

Because it's a real browser, layout works. You can measure SVG nodes and check where things end up on screen.

Download Chromium once with `bun run test:install-browsers` in `frontend/`.
