import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("redirects to the login page when signed out", async () => {
  const screen = await renderApp("/", { session: null });

  await expect.element(screen.getByRole("heading", { name: "Log in", level: 1 })).toBeVisible();
});

it("renders the dashboard when signed in", async () => {
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});
