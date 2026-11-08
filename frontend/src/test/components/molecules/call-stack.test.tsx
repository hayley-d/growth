import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { CallFrame } from "@shared/avl";
import { CallStack } from "@/components/molecules/call-stack";

it("lists the calls in order and marks the one that is running", async () => {
  const frames: CallFrame[] = [
    { algorithm: "insert", node: 30 },
    { algorithm: "insert", node: 20 },
    { algorithm: "rebalance", node: 20 },
  ];
  const screen = await render(<CallStack frames={frames} language="pseudocode" />);
  const items = screen.getByRole("listitem").elements();

  expect(items.map((item) => item.textContent)).toEqual([
    "insert(30)",
    "insert(20)",
    "rebalance(20)",
  ]);
  expect(items[2]?.getAttribute("aria-current")).toBe("step");
  expect(items[0]?.getAttribute("aria-current")).toBeNull();
});

it("stops indenting deep calls so the stack fits the panel", async () => {
  const frames: CallFrame[] = Array.from({ length: 20 }, (_, index) => ({
    algorithm: "preorder",
    node: index,
  }));
  const screen = await render(<CallStack frames={frames} language="pseudocode" />);
  const items = screen.getByRole("listitem").elements() as HTMLElement[];

  expect(items[19]?.style.paddingLeft).toBe(items[8]?.style.paddingLeft);
  expect(items[8]?.style.paddingLeft).not.toBe(items[7]?.style.paddingLeft);
});
