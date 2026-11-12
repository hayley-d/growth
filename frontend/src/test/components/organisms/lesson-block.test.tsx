import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { LessonStepBlock } from "@shared/schemas";
import { LessonBlock } from "@/components/organisms/lesson-block";
import { TreeModeProvider } from "@/lib/lesson/tree-mode";
import "@/index.css";

const zigZag = (treeMode?: "bst" | "avl"): LessonStepBlock => ({
  id: "4f6f7c1e-0f3b-4d55-9d0e-6a1a3a0b9c11",
  type: "diagram",
  transcript: "30 at the top, 10 on its left, 20 on the right of 10.",
  learningStyleId: null,
  body: { startingKeys: [30, 10, 20], highlights: [], caption: "A zig-zag", treeMode },
});

const rootKey = (container: HTMLElement) => {
  const keys = [...container.querySelectorAll("svg text")]
    .filter((text) => ["10", "20", "30"].includes(text.textContent ?? ""))
    .map((text) => ({ key: text.textContent, y: Number(text.getAttribute("y")) }));
  if (keys.length < 3) return null;
  return keys.reduce((top, key) => (key.y < top.y ? key : top)).key;
};

it("balances a diagram's keys in an AVL unit", async () => {
  const screen = await render(
    <TreeModeProvider mode="avl">
      <LessonBlock block={zigZag()} />
    </TreeModeProvider>,
  );
  await expect.poll(() => rootKey(screen.container)).toBe("20");
});

it("draws a diagram as given when it asks for a plain search tree", async () => {
  const screen = await render(
    <TreeModeProvider mode="avl">
      <LessonBlock block={zigZag("bst")} />
    </TreeModeProvider>,
  );
  await expect.poll(() => rootKey(screen.container)).toBe("30");
});
