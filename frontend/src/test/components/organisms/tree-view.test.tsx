import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { type AvlNode, insertKey } from "@shared/avl";
import { TreeView } from "@/components/organisms/tree-view";
import "@/index.css";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);

const stepped: AvlNode = {
  key: 30,
  height: 4,
  right: { key: 40, height: 1, left: null, right: null },
  left: {
    key: 20,
    height: 3,
    right: null,
    left: {
      key: 10,
      height: 2,
      right: null,
      left: { key: 5, height: 1, left: null, right: null },
    },
  },
};

const renderTree = (properties: Parameters<typeof TreeView>[0]) =>
  render(
    <div className="h-96 w-full">
      <TreeView {...properties} />
    </div>,
  );

const viewBoxSize = (container: HTMLElement) => {
  const [width, height] = (container.querySelector("svg")?.getAttribute("viewBox") ?? "")
    .split(" ")
    .slice(2)
    .map(Number);
  return { width, height };
};

it("draws each key in the snapshot", async () => {
  const screen = await renderTree({ root: build([20, 10, 30, 5]) });

  await expect.element(screen.getByText("5", { exact: true })).toBeVisible();
  await expect.element(screen.getByText("10", { exact: true })).toBeVisible();
  await expect.element(screen.getByText("20", { exact: true })).toBeVisible();
  await expect.element(screen.getByText("30", { exact: true })).toBeVisible();

  const svg = screen.container.querySelector("svg");
  expect(svg?.getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
  expect(svg?.classList.contains("h-full")).toBe(true);
  expect(svg?.classList.contains("w-full")).toBe(true);
});

it("shows height and balance factor when asked", async () => {
  const screen = await renderTree({
    root: build([20, 10, 30, 5]),
    showHeight: true,
    showBalance: true,
  });

  await expect.element(screen.getByText("h 3", { exact: true })).toBeVisible();
  await expect.element(screen.getByText("h 2", { exact: true })).toBeVisible();
  const labels = [...screen.container.querySelectorAll("text")].map((node) => node.textContent);
  expect(labels.filter((label) => label === "1")).toHaveLength(2);
});

it("hides height and balance factor by default", async () => {
  const screen = await renderTree({ root: build([20, 10, 30, 5]) });

  await expect.element(screen.getByText("h 3", { exact: true })).not.toBeInTheDocument();
  const labels = [...screen.container.querySelectorAll("text")].map((node) => node.textContent);
  expect(labels).not.toContain("1");
});

it("selects a manual node by click and by keyboard", async () => {
  const onSelectKey = vi.fn();
  const screen = await renderTree({
    root: stepped,
    manual: true,
    selectedKey: 30,
    onSelectKey,
    nodeStates: {
      30: "active",
      5: "visited",
      40: "deleting",
      20: "unbalanced",
      10: "new",
    },
  });

  const active = screen.getByRole("button", { name: "30, active, balance factor 2" });
  await expect.element(active).toHaveAttribute("aria-pressed", "true");
  await expect
    .element(screen.getByRole("button", { name: "40, about to be deleted, balance factor 0" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "10, new, balance factor 1" }))
    .toHaveAttribute("aria-pressed", "false");
  await expect.element(screen.getByText("2", { exact: true })).toBeVisible();
  expect(screen.container.querySelectorAll("circle[stroke-dasharray]").length).toBe(1);
  expect(screen.container.querySelectorAll("polygon").length).toBe(1);

  await active.click();
  expect(onSelectKey).toHaveBeenCalledWith(30);

  onSelectKey.mockClear();
  const deleting = screen.getByRole("button", {
    name: "40, about to be deleted, balance factor 0",
  });
  deleting.element().focus();
  await userEvent.keyboard("{Enter}");
  expect(onSelectKey).toHaveBeenCalledWith(40);
});

it("leaves the tree as a picture when selection is off", async () => {
  const screen = await renderTree({
    root: build([20, 10]),
    nodeStates: { 20: "active" },
  });

  await expect.element(screen.getByRole("img", { name: "Tree" })).toBeVisible();
  await expect.element(screen.getByRole("button")).not.toBeInTheDocument();
});

it("uses a larger view box for a larger tree", async () => {
  const one = await renderTree({ root: build([20]) });
  const four = await renderTree({ root: build([20, 10, 30, 5]) });
  const small = viewBoxSize(one.container);
  const large = viewBoxSize(four.container);

  expect(large.width).toBeGreaterThan(small.width ?? 0);
  expect(large.height).toBeGreaterThan(small.height ?? 0);
});

it("names an empty tree", async () => {
  const screen = await renderTree({ root: null });

  await expect.element(screen.getByRole("img", { name: "Empty tree" })).toBeVisible();
});

const textsOf = (container: HTMLElement) =>
  [...container.querySelectorAll("text")].map((node) => node.textContent);

const stubReducedMotion = (matches: boolean) => {
  const original = window.matchMedia.bind(window);
  window.matchMedia = (query: string) => {
    const list = original(query);
    return {
      matches: query.includes("prefers-reduced-motion") ? matches : list.matches,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
  return () => {
    window.matchMedia = original;
  };
};

it("keeps a manual button on its node", async () => {
  const screen = await renderTree({ root: build([20, 10]), manual: true });
  const text = screen.getByText("20", { exact: true }).element().getBoundingClientRect();
  const button = screen
    .getByRole("button", { name: "20, balance factor 1" })
    .element()
    .getBoundingClientRect();

  expect(Math.abs(text.x + text.width / 2 - (button.x + button.width / 2))).toBeLessThan(2);
  expect(Math.abs(text.y + text.height / 2 - (button.y + button.height / 2))).toBeLessThan(2);
});

it("fades a deleted node out and drops a new one in", async () => {
  const restore = stubReducedMotion(false);
  try {
    const screen = await renderTree({ root: build([20, 10, 30]) });
    await screen.rerender(
      <div className="h-96 w-full">
        <TreeView root={build([20, 30, 40])} />
      </div>,
    );

    expect(textsOf(screen.container)).toContain("10");
    await expect.element(screen.getByText("10", { exact: true })).not.toBeInTheDocument();
    await expect.element(screen.getByText("40", { exact: true })).toBeVisible();
  } finally {
    restore();
  }
});

it("changes the tree straight away when reduced motion is on", async () => {
  const restore = stubReducedMotion(true);
  try {
    const screen = await renderTree({ root: build([20, 10, 30]) });
    await screen.rerender(
      <div className="h-96 w-full">
        <TreeView root={build([20, 30])} />
      </div>,
    );
    await expect.poll(() => textsOf(screen.container).includes("10"), { timeout: 150 }).toBe(false);
  } finally {
    restore();
  }
});

const leaning: AvlNode = {
  key: 30,
  height: 3,
  right: null,
  left: {
    key: 20,
    height: 2,
    right: null,
    left: { key: 10, height: 1, left: null, right: null },
  },
};

const turned: AvlNode = {
  key: 20,
  height: 2,
  left: { key: 10, height: 1, left: null, right: null },
  right: { key: 30, height: 1, left: null, right: null },
};

it("keeps the link when a rotation swaps parent and child", async () => {
  const restore = stubReducedMotion(false);
  try {
    const screen = await renderTree({ root: leaning });
    await screen.rerender(
      <div className="h-96 w-full">
        <TreeView root={turned} />
      </div>,
    );
    const base = [...screen.container.querySelectorAll("line")].filter(
      (line) => line.getAttribute("stroke") === "currentColor",
    );

    expect(base).toHaveLength(2);
  } finally {
    restore();
  }
});

it("draws every edge the same whatever state its nodes are in", async () => {
  const screen = await renderTree({
    root: build([20, 10, 30]),
    nodeStates: { 20: "active", 10: "visited" },
  });
  const lines = [...screen.container.querySelectorAll("line")];

  expect(lines).toHaveLength(2);
  expect(lines.every((line) => line.getAttribute("stroke") === "currentColor")).toBe(true);
});

it("draws a drop spot for each slot and fills the active one", async () => {
  const screen = await render(
    <TreeView
      root={build([30, 20])}
      slots={[
        { id: "20-left", x: -0.4, y: 2 },
        { id: "30-right", x: 1.4, y: 1 },
      ]}
      activeSlotId="30-right"
    />,
  );

  const spots = screen.container.querySelectorAll("[data-drop='slot']");
  expect([...spots].map((spot) => spot.getAttribute("data-slot-id"))).toEqual([
    "20-left",
    "30-right",
  ]);
  expect(spots[1]?.querySelector("circle")?.getAttribute("fill")).toBe("var(--primary)");
  expect(spots[0]?.querySelector("circle")?.getAttribute("stroke-dasharray")).toBe("4 3");
});

it("draws one balance badge on an unbalanced node", async () => {
  const screen = await render(
    <TreeView root={build([65])} nodeStates={{ 65: "unbalanced" }} showBalance />,
  );

  const labels = [...screen.container.querySelectorAll("text")].map((node) => node.textContent);
  expect(labels.filter((label) => label === "0")).toHaveLength(1);
});
