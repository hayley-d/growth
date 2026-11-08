import { useState } from "react";
import { expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TraceLayout } from "@/components/organisms/trace-layout";

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
