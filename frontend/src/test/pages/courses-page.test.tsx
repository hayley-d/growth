import { expect, it } from "vitest";

import { renderApp } from "@/test/render-app";

it("shows the courses empty state", async () => {
  const screen = await renderApp("/courses");

  await expect.element(screen.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("No courses yet")).toBeVisible();
});
