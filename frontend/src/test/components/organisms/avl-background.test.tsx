import { afterEach, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { AvlBackground } from "@/components/organisms/avl-background";
import "@/index.css";

afterEach(async () => {
  await page.viewport(1280, 800);
});

const renderBackground = () =>
  render(
    <div className="relative h-96">
      <AvlBackground />
      <button type="button">Behind</button>
    </div>,
  );

it("draws trees that are hidden from assistive tech and ignore clicks", async () => {
  await page.viewport(1280, 800);
  const screen = await renderBackground();

  const layer = screen.container.querySelector("[aria-hidden='true']");
  expect(layer).not.toBeNull();
  expect(layer?.querySelectorAll("svg").length).toBe(3);
  expect(getComputedStyle(layer as Element).pointerEvents).toBe("none");
  await expect.poll(() => layer?.querySelectorAll("circle").length ?? 0).toBeGreaterThan(0);
  await expect.element(screen.getByRole("button", { name: "Behind" })).toBeVisible();
});

it("only mounts one tree on phones", async () => {
  await page.viewport(375, 800);
  const screen = await renderBackground();

  const layer = screen.container.querySelector("[aria-hidden='true']");
  expect(layer?.querySelectorAll("svg").length).toBe(1);
});

it("mounts the extra trees when the screen grows", async () => {
  await page.viewport(375, 800);
  const screen = await renderBackground();
  const layer = screen.container.querySelector("[aria-hidden='true']");

  await page.viewport(768, 800);
  await expect.poll(() => layer?.querySelectorAll("svg").length).toBe(2);
});
