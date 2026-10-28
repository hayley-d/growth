import { afterEach, expect, it } from "vitest";

import { authQueryKeys } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import { renderApp } from "@/test/render-app";

afterEach(() => {
  queryClient.setQueryDefaults(authQueryKeys.session, {});
});

it("redirects to the login page when signed out", async () => {
  const screen = await renderApp("/", { session: null });

  await expect.element(screen.getByRole("heading", { name: "Log in", level: 1 })).toBeVisible();
});

it("renders the dashboard when signed in", async () => {
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});

it("shows an error page with a retry button when the session request fails", async () => {
  queryClient.setQueryDefaults(authQueryKeys.session, { retry: false });

  const screen = await renderApp("/", {
    sessionError: { message: "Service unavailable", status: 503 },
  });

  await expect
    .element(screen.getByRole("heading", { name: "We can't reach Growth right now", level: 1 }))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Try again" })).toBeVisible();
});
