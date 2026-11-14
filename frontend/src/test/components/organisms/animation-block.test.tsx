import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { AnimationBlock } from "@/components/organisms/animation-block";
import "@/index.css";

const renderBlock = () =>
  render(
    <AnimationBlock
      startingKeys={[]}
      operations={[
        { operation: "insert", key: 8 },
        { operation: "insert", key: 4 },
        { operation: "insert", key: 12 },
      ]}
      autoplay={false}
    />,
  );

it("keeps the block and the controls still while the step text changes", async () => {
  await page.viewport(1280, 720);
  const screen = await renderBlock();
  const block = screen.getByRole("group", { name: "Animation" });
  const forward = screen.getByRole("button", { name: "Forward one step" });
  const heights = new Set<number>();
  const playTops = new Set<number>();
  const messages = new Set<string>();

  for (let index = 0; index < 12; index += 1) {
    heights.add(Math.round(block.element().getBoundingClientRect().height));
    playTops.add(
      Math.round(
        screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect().top,
      ),
    );
    messages.add(block.element().querySelector("[aria-live]")?.textContent ?? "");
    await forward.click();
  }

  expect(messages.size).toBeGreaterThan(3);
  expect(heights.size).toBe(1);
  expect(playTops.size).toBe(1);
});

it("puts the message and controls beside the tree on a wide screen", async () => {
  await page.viewport(1280, 720);
  const screen = await renderBlock();

  const tree = screen.getByRole("img").element().getBoundingClientRect();
  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();

  expect(play.left).toBeGreaterThan(tree.right);
});

it("puts the controls under the tree on a phone", async () => {
  await page.viewport(375, 720);
  const screen = await renderBlock();

  const tree = screen.getByRole("img").element().getBoundingClientRect();
  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();

  expect(play.top).toBeGreaterThan(tree.bottom);
});
