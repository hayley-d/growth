import { useState } from "react";
import { expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TraceLayout } from "@/components/organisms/trace-layout";
import "@/index.css";

const renderLayout = () =>
  render(
    <TraceLayout
      tree={<p>the tree</p>}
      code={<p>the code</p>}
      message={<p>the message</p>}
      controls={<button type="button">Play</button>}
    />,
  );

it("puts the tree and the code side by side on a wide screen", async () => {
  await page.viewport(1280, 800);
  const screen = await renderLayout();

  await expect.element(screen.getByText("the tree")).toBeVisible();
  await expect.element(screen.getByText("the code")).toBeVisible();
  await expect.element(screen.getByRole("tab", { name: "Tree" })).not.toBeInTheDocument();
});

it("switches between Tree and Code tabs on a phone and keeps the message on both", async () => {
  await page.viewport(375, 800);
  const screen = await renderLayout();

  await expect
    .element(screen.getByRole("tab", { name: "Tree" }))
    .toHaveAttribute("aria-selected", "true");
  await expect.element(screen.getByText("the tree")).toBeVisible();
  await expect.element(screen.getByText("the code")).not.toBeVisible();
  await expect.element(screen.getByText("the message")).toBeVisible();

  await screen.getByRole("tab", { name: "Code" }).click();

  await expect.element(screen.getByText("the code")).toBeVisible();
  await expect.element(screen.getByText("the tree")).not.toBeVisible();
  await expect.element(screen.getByText("the message")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Play" })).toBeVisible();
});

it("moves focus to the new tab when the arrow keys change it", async () => {
  await page.viewport(375, 800);
  const screen = await renderLayout();
  const treeTab = screen.getByRole("tab", { name: "Tree" });
  const codeTab = screen.getByRole("tab", { name: "Code" });

  await treeTab.click();
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(codeTab).toHaveAttribute("aria-selected", "true");
  await expect.element(codeTab).toHaveFocus();

  await userEvent.keyboard("{ArrowLeft}");

  await expect.element(treeTab).toHaveAttribute("aria-selected", "true");
  await expect.element(treeTab).toHaveFocus();
});

it("jumps to the first and last tab with Home and End", async () => {
  await page.viewport(375, 800);
  const screen = await renderLayout();
  const treeTab = screen.getByRole("tab", { name: "Tree" });
  const codeTab = screen.getByRole("tab", { name: "Code" });

  await treeTab.click();
  await userEvent.keyboard("{End}");

  await expect.element(codeTab).toHaveAttribute("aria-selected", "true");
  await expect.element(codeTab).toHaveFocus();

  await userEvent.keyboard("{Home}");

  await expect.element(treeTab).toHaveAttribute("aria-selected", "true");
  await expect.element(treeTab).toHaveFocus();
});

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      {name} {count}
    </button>
  );
}

it("keeps the tree and the code mounted when the screen crosses the breakpoint", async () => {
  await page.viewport(1280, 800);
  const screen = await render(
    <TraceLayout
      tree={<Counter name="tree" />}
      code={<Counter name="code" />}
      message={<p>the message</p>}
    />,
  );

  await screen.getByRole("button", { name: "tree 0" }).click();
  await screen.getByRole("button", { name: "code 0" }).click();

  await page.viewport(375, 800);
  await expect.element(screen.getByRole("tab", { name: "Tree" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "tree 1" })).toBeVisible();

  await screen.getByRole("tab", { name: "Code" }).click();
  await expect.element(screen.getByRole("button", { name: "code 1" })).toBeVisible();

  await page.viewport(1280, 800);
  await expect.element(screen.getByRole("tab", { name: "Tree" })).not.toBeInTheDocument();
  await expect.element(screen.getByRole("button", { name: "tree 1" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "code 1" })).toBeVisible();
});

it("hides the code and the tabs when the code is hidden", async () => {
  await page.viewport(375, 800);
  const screen = await render(
    <TraceLayout
      tree={<p>the tree</p>}
      code={<p>the code</p>}
      message={<p>the message</p>}
      codeHidden
    />,
  );

  await expect.element(screen.getByText("the tree")).toBeVisible();
  await expect.element(screen.getByText("the code")).not.toBeVisible();
  await expect.element(screen.getByRole("tab", { name: "Code" })).not.toBeInTheDocument();
});

it("keeps the same tree panel when the code is shown again", async () => {
  await page.viewport(1280, 800);
  function Toggle() {
    const [hidden, setHidden] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setHidden((current) => !current)}>
          Toggle
        </button>
        <TraceLayout
          tree={<p>the tree</p>}
          code={<p>the code</p>}
          message={<p>the message</p>}
          codeHidden={hidden}
        />
      </>
    );
  }
  const screen = await render(<Toggle />);
  const before = screen.getByText("the tree").element();

  await screen.getByRole("button", { name: "Toggle" }).click();
  await expect.element(screen.getByText("the code")).not.toBeVisible();
  await screen.getByRole("button", { name: "Toggle" }).click();

  await expect.element(screen.getByText("the code")).toBeVisible();
  expect(screen.getByText("the tree").element()).toBe(before);
});

const renderTallLayout = () =>
  render(
    <TraceLayout
      tree={<div className="h-[1500px]">the tree</div>}
      code={<p>the code</p>}
      message={<p>the message</p>}
      controls={<button type="button">Play</button>}
    />,
  );

it("keeps the message and the controls on screen when the card is taller than the screen", async () => {
  await page.viewport(1280, 600);
  const screen = await renderTallLayout();

  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();
  const message = screen.getByText("the message").element().getBoundingClientRect();

  expect(play.bottom).toBeLessThanOrEqual(window.innerHeight);
  expect(message.top).toBeGreaterThanOrEqual(0);
  expect(message.bottom).toBeLessThanOrEqual(play.top);
});

it("keeps the controls above a fixed footer named by --dock-bottom", async () => {
  await page.viewport(1280, 600);
  const screen = await render(
    <div className="[--dock-bottom:4rem]">
      <TraceLayout
        tree={<div className="h-[1500px]">the tree</div>}
        code={<p>the code</p>}
        message={<p>the message</p>}
        controls={<button type="button">Play</button>}
      />
    </div>,
  );

  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();

  expect(play.bottom).toBeLessThanOrEqual(window.innerHeight - 64);
});

it("leaves the controls under the tree when they are not pinned", async () => {
  await page.viewport(1280, 600);
  const screen = await render(
    <TraceLayout
      tree={<div className="h-[1500px]">the tree</div>}
      code={<p>the code</p>}
      message={<p>the message</p>}
      controls={<button type="button">Play</button>}
      pinControls={false}
    />,
  );

  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();

  expect(play.top).toBeGreaterThan(window.innerHeight);
});

it("leaves the controls under the tree on a phone", async () => {
  await page.viewport(375, 600);
  const screen = await renderTallLayout();

  const play = screen.getByRole("button", { name: "Play" }).element().getBoundingClientRect();

  expect(play.top).toBeGreaterThan(window.innerHeight);
});
