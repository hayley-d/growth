import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { TreeViewport } from "@/components/organisms/tree-viewport";
import "@/index.css";

const pointer = (type: string, x: number, y: number, pointerType = "mouse") =>
  new PointerEvent(type, { bubbles: true, button: 0, pointerType, clientX: x, clientY: y });

const renderZoomed = async () => {
  const screen = await render(
    <TreeViewport className="h-64 w-64">
      <div className="grid h-full w-full place-items-center">
        <button type="button" data-node-key="10">
          10
        </button>
      </div>
    </TreeViewport>,
  );
  const zoomIn = screen.getByRole("button", { name: "Zoom in" });
  await zoomIn.click();
  await zoomIn.click();
  await expect.element(screen.getByRole("status")).toHaveTextContent("200%");
  const node = screen.getByRole("button", { name: "10" }).element();
  const scroller = node.parentElement?.parentElement?.parentElement as HTMLElement;
  return { screen, node, scroller, background: node.parentElement as HTMLElement };
};

it("zooms in and out in steps and resets to 100%", async () => {
  const screen = await render(
    <TreeViewport className="h-64">
      <p>Tree</p>
    </TreeViewport>,
  );
  const level = screen.getByRole("status");

  await expect.element(level).toHaveTextContent("100%");
  await expect.element(screen.getByRole("button", { name: "Reset zoom" })).toBeDisabled();

  await screen.getByRole("button", { name: "Zoom in" }).click();
  await expect.element(level).toHaveTextContent("150%");

  await screen.getByRole("button", { name: "Reset zoom" }).click();
  await screen.getByRole("button", { name: "Zoom out" }).click();
  await expect.element(level).toHaveTextContent("75%");
});

it("stops at the smallest and largest zoom", async () => {
  const screen = await render(
    <TreeViewport>
      <p>Tree</p>
    </TreeViewport>,
  );
  const zoomOut = screen.getByRole("button", { name: "Zoom out" });
  await zoomOut.click();
  await zoomOut.click();
  await expect.element(screen.getByRole("status")).toHaveTextContent("50%");
  await expect.element(zoomOut).toBeDisabled();

  const zoomIn = screen.getByRole("button", { name: "Zoom in" });
  for (let count = 0; count < 6; count += 1) await zoomIn.click();
  await expect.element(screen.getByRole("status")).toHaveTextContent("400%");
  await expect.element(zoomIn).toBeDisabled();
});

it("puts the zoom controls in the top-right corner of the box", async () => {
  const { screen, scroller } = await renderZoomed();
  const box = scroller.getBoundingClientRect();
  const controls = screen.getByRole("group", { name: "Zoom" }).element().getBoundingClientRect();
  expect(controls.top - box.top).toBeGreaterThanOrEqual(0);
  expect(controls.top - box.top).toBeLessThan(16);
  expect(box.right - controls.right).toBeGreaterThanOrEqual(0);
  expect(box.right - controls.right).toBeLessThan(16);
});

it("keeps the tree below the zoom controls at 100%", async () => {
  const screen = await render(
    <TreeViewport className="h-64 w-64">
      <div data-testid="tree" className="h-full w-full" />
    </TreeViewport>,
  );
  const tree = screen.getByTestId("tree").element().getBoundingClientRect();
  const controls = screen.getByRole("group", { name: "Zoom" }).element().getBoundingClientRect();
  expect(tree.top).toBeGreaterThanOrEqual(controls.bottom);
});

it("pans when the mouse drags empty space", async () => {
  const { scroller, background } = await renderZoomed();
  const startLeft = scroller.scrollLeft;
  background.dispatchEvent(pointer("pointerdown", 200, 200));
  await expect.poll(() => scroller.className).toContain("cursor-grabbing");
  await new Promise(requestAnimationFrame);
  window.dispatchEvent(pointer("pointermove", 150, 170));
  window.dispatchEvent(pointer("pointerup", 150, 170));
  expect(scroller.scrollLeft).toBe(startLeft + 50);
});

it("leaves a drag that starts on a node alone", async () => {
  const { scroller, node } = await renderZoomed();
  const startLeft = scroller.scrollLeft;
  node.dispatchEvent(pointer("pointerdown", 200, 200));
  window.dispatchEvent(pointer("pointermove", 150, 170));
  window.dispatchEvent(pointer("pointerup", 150, 170));
  expect(scroller.scrollLeft).toBe(startLeft);
  expect(scroller.className).not.toContain("cursor-grabbing");
});

it("leaves touch to the browser's own scrolling", async () => {
  const { scroller, background } = await renderZoomed();
  const startLeft = scroller.scrollLeft;
  background.dispatchEvent(pointer("pointerdown", 200, 200, "touch"));
  window.dispatchEvent(pointer("pointermove", 150, 170, "touch"));
  expect(scroller.scrollLeft).toBe(startLeft);
  expect(scroller.className).not.toContain("cursor-grabbing");
});

it("keeps the middle of the tree in view when zooming", async () => {
  const { scroller } = await renderZoomed();
  const middle = (scroller.scrollLeft + scroller.clientWidth / 2) / scroller.scrollWidth;
  expect(middle).toBeCloseTo(0.5, 1);
});
