import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows the dashboard with empty states", async () => {
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("No lessons started yet")).toBeVisible();
});

it("goes to Learn from the empty state", async () => {
  const screen = await renderApp("/");

  await screen.getByRole("main").getByRole("link", { name: "Go to Learn" }).click();

  await expect.element(screen.getByRole("heading", { name: "Learn", level: 1 })).toBeVisible();
});
