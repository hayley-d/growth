import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows the dashboard with empty states", async () => {
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("No courses started yet")).toBeVisible();
});

it("goes to courses from the empty state", async () => {
  const screen = await renderApp("/");

  await screen.getByRole("main").getByRole("link", { name: "Browse courses" }).click();

  await expect.element(screen.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
});
