import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { DiagramBlock } from "@/components/organisms/diagram-block";
import { TextBlock } from "@/components/organisms/text-block";
import { TreeLinksProvider } from "@/lib/lesson/tree-links";
import "@/index.css";

const leaves = [2, 6, 10, 14];
const keys = [8, 4, 12, 2, 6, 10, 14];

const renderStep = (withDiagram = true) =>
  render(
    <TreeLinksProvider>
      <TextBlock
        id="text"
        markdown="A node with no children is a **leaf**. The **root** is at the top."
        terms={{ leaf: leaves, root: [8] }}
      />
      {withDiagram ? (
        <DiagramBlock
          startingKeys={keys}
          highlights={[]}
          labels={[{ text: ["The four leaves"], keys: leaves, place: "below" }]}
          caption="The leaves."
          description="A tree."
        />
      ) : null}
    </TreeLinksProvider>,
  );

const litNodes = (container: HTMLElement) =>
  [...container.querySelectorAll("circle[fill='var(--accent)']")].length;

it("lights a word's nodes and label while it's pointed at", async () => {
  const screen = await renderStep();
  const leaf = screen.getByRole("button", { name: "leaf" });

  await leaf.hover();
  await expect.poll(() => litNodes(screen.container)).toBe(4);
  await expect
    .poll(() => screen.container.querySelector("[data-label-keys='2,6,10,14']"))
    .toHaveAttribute("data-lit", "true");

  await screen.getByRole("button", { name: "root" }).hover();
  await expect.poll(() => litNodes(screen.container)).toBe(1);
});

it("keeps a tapped word lit", async () => {
  const screen = await renderStep();
  const leaf = screen.getByRole("button", { name: "leaf" });

  await leaf.click();
  await expect.element(leaf).toHaveAttribute("aria-pressed", "true");
  await leaf.click();
  await expect.element(leaf).toHaveAttribute("aria-pressed", "false");
});

it("lights a word when its node is pointed at", async () => {
  const screen = await renderStep();
  const leaf = screen.getByRole("button", { name: "leaf" });
  await expect.element(leaf).toBeVisible();
  const node = [...screen.container.querySelectorAll("text")].find(
    (text) => text.textContent === "14",
  );
  if (!node) throw new Error("node 14 isn't drawn");

  await userEvent.hover(node);

  await expect.element(leaf).toHaveAttribute("data-lit", "true");
});

it("leaves a word plain when no tree shows its nodes", async () => {
  const screen = await renderStep(false);

  await expect.element(screen.getByText("leaf")).toBeVisible();
  expect(screen.container.querySelector("button")).toBeNull();
});

it("hides the caption when there are labels and names the tree with them", async () => {
  const screen = await renderStep();

  await expect.element(screen.getByText("The leaves.")).toHaveClass("sr-only");
  await expect
    .element(screen.getByRole("img", { name: "The leaves. The four leaves." }))
    .toBeInTheDocument();
});
