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

`__root.tsx` wraps every page in `AppLayout` (`components/templates/app-layout.tsx`): the `Navbar` on top and the page below. The navbar shows the logo, the nav links and the user menu. On phones the links move into a slide-out menu. Unknown URLs show `NotFoundPage`.

The user menu shows the signed-in user's name and email, with Settings and Sign out. If signing out fails, the menu stays open and shows why.

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

The root route loads the session in `beforeLoad` with `queryClient.fetchQuery(sessionQueryOptions)` and puts it in the router context, where `_authenticated.tsx`, `login.tsx` and `sign-up.tsx` read it. `fetchQuery` asks the server again whenever the cached session is stale, which is after 60 seconds or straight after sign-in, sign-up or sign-out. If the session request fails, `beforeLoad` throws a `SessionLoadError`. The root's `RootErrorPage` shows `SessionErrorPage` for that error, which says the server can't be reached and has a Try again button. It doesn't treat the user as signed out. Any other error from a page shows `ErrorPage` inside `AppLayout`, so the navbar stays.

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

`auth-service` is the one service that doesn't use `networkService`. It calls Better Auth's `authClient` instead, but follows the same rules: failures become a `ServiceError`, and the session is checked with `sessionResponseSchema` from `@shared/schemas/auth` before anything uses it.

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
