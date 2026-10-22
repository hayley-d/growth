import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows a not found page for unknown paths", async () => {
  const screen = await renderApp("/does-not-exist");

  await expect.element(screen.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await screen.getByRole("link", { name: "Back to dashboard" }).click();
  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});
