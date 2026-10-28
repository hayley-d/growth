import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { SessionLoadError } from "@/lib/session-load-error";
import { RootErrorPage } from "@/pages/root-error-page";
import "@/index.css";

const renderWithError = (error: Error) => {
  queryClient.clear();
  vi.mocked(authClient.getSession).mockResolvedValue({ data: null, error: null });

  const rootRoute = createRootRoute({ component: Outlet, errorComponent: RootErrorPage });
  const brokenRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: () => {
      throw error;
    },
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([brokenRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

it("shows a general error page with the navbar when a page fails", async () => {
  const screen = await renderWithError(new Error("Something broke"));

  await expect
    .element(screen.getByRole("heading", { name: "Something went wrong", level: 1 }))
    .toBeVisible();
  await expect.element(screen.getByRole("navigation").first()).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Try again" })).toBeVisible();
});

it("shows the connection error page when the session can't be loaded", async () => {
  const screen = await renderWithError(new SessionLoadError(new Error("Service unavailable")));

  await expect
    .element(screen.getByRole("heading", { name: "We can't reach Growth right now", level: 1 }))
    .toBeVisible();
});
