import { afterEach, expect, it } from "vitest";
import { page } from "vitest/browser";

import { renderApp } from "@/test/render-app";

afterEach(async () => {
  await page.viewport(1280, 800);
});

it("shows the nav links and user menu on desktop", async () => {
  await page.viewport(1280, 800);
  const screen = await renderApp("/");
  const navigation = screen.getByRole("navigation", { name: "Main" });

  await expect.element(navigation.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect.element(navigation.getByRole("link", { name: "Courses" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Open menu" })).not.toBeInTheDocument();

  await screen.getByRole("button", { name: "Open user menu" }).click();
  await expect.element(page.getByRole("menuitem", { name: "Sign out" })).toBeVisible();
});

it("uses a menu button on phones", async () => {
  await page.viewport(375, 800);
  const screen = await renderApp("/");

  await expect
    .element(
      screen.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Courses" }),
    )
    .not.toBeInTheDocument();

  await screen.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await menu.getByRole("link", { name: "Courses" }).click();

  await expect.element(screen.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
  await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
});
