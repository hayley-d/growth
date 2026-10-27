import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { AvlBackground } from "@/components/organisms/avl-background";
import "@/index.css";

it("draws trees that are hidden from assistive tech and ignore clicks", async () => {
  const screen = await render(
    <div className="relative h-96">
      <AvlBackground />
      <button type="button">Behind</button>
    </div>,
  );

  const layer = screen.container.querySelector("[aria-hidden='true']");
  expect(layer).not.toBeNull();
  expect(layer?.querySelectorAll("svg").length).toBe(3);
  expect(getComputedStyle(layer as Element).pointerEvents).toBe("none");
  await expect.poll(() => layer?.querySelectorAll("circle").length ?? 0).toBeGreaterThan(0);
  await expect.element(screen.getByRole("button", { name: "Behind" })).toBeVisible();
});
