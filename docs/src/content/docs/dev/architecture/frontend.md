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
  config.ts               where the API lives
```

## Atomic design

Each level only composes the levels below it. An organism may use molecules and atoms but never another organism's internals. Templates arrange organisms without knowing where data comes from, and pages supply that data.

shadcn is configured to generate into `components/atoms`. Plain Tailwind is preferred, so add a shadcn component only when it saves real effort.

## Mobile first

The app must work fully on phones. Build for a small screen first, then add `sm:` and `md:` styles for bigger ones. Check every page at 375px wide: nothing should scroll sideways, and anything you can tap should be at least 44px (`min-h-11` or `size-11`).

## App shell

`__root.tsx` wraps every page in `AppLayout` (`components/templates/app-layout.tsx`): the `Navbar` on top and the page below. The navbar shows the logo, the nav links and the user menu. On phones the links move into a slide-out menu. Unknown URLs show `NotFoundPage`.

The user menu shows a placeholder user from `lib/placeholder-user.ts` until sign-in exists.

## Routing

Routes live in `src/routes` and are discovered by the TanStack Router Vite plugin, which generates `routeTree.gen.ts`. A route file stays thin and renders a page from `src/pages`.

## Services

Every API call lives in `src/services`. Components never call axios themselves.

Each feature gets its own folder:

```
services/tree-service/
  tree.urls.ts          the endpoints
  tree.service.ts       the functions that call them
  tree.service.test.ts  tests, with the network mocked
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

To test a phone layout, call `await page.viewport(375, 800)` (from `vitest/browser`) before rendering. Hidden elements drop out of role queries, so check them with `not.toBeInTheDocument()`.

Because it's a real browser, layout works. You can measure SVG nodes and check where things end up on screen.

Download Chromium once with `bun run test:install-browsers` in `frontend/`.
