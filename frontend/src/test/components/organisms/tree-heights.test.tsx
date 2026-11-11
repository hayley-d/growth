import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { TreeHeights } from "@/components/organisms/tree-heights";
import "@/index.css";

const keys = [8, 4, 12, 2, 6, 10, 14];
const caption = "A node's height is 1 more than its taller subtree.";

const renderHeights = () =>
  render(
    <div className="w-[640px]">
      <TreeHeights startingKeys={keys} caption={caption} />
    </div>,
  );

const heightsSoFar = (container: HTMLElement) =>
  [...container.querySelectorAll("ol[aria-label='Heights so far'] li")].map(
    (item) => item.textContent,
  );

it("starts with no heights", async () => {
  const screen = await renderHeights();

  await expect.element(screen.getByText("Press Step to start.")).toBeVisible();
  await expect.element(screen.getByText(caption)).toBeVisible();
  await expect.element(screen.getByText("0 of 7")).toBeVisible();
  expect(heightsSoFar(screen.container)).toEqual([]);
});

it("gives a leaf height 1, then its parent 1 more than its taller child", async () => {
  const screen = await renderHeights();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await expect
    .element(
      screen.getByText(
        "2 is a leaf. Both its children are empty, with height 0, so its height is 1 + max(0, 0) = 1.",
      ),
    )
    .toBeVisible();

  await step.click();
  await step.click();
  await expect
    .element(
      screen.getByText(
        "4's left subtree has height 1 and its right subtree has height 1, so its height is 1 + max(1, 1) = 2.",
      ),
    )
    .toBeVisible();
  expect(heightsSoFar(screen.container)).toEqual(["2: 1", "6: 1", "4: 2"]);
  await expect
    .element(screen.getByRole("img", { name: "Tree, heights worked out for 2, 6, 4" }))
    .toBeVisible();
});

it("ends at the root with the height of the whole tree", async () => {
  const screen = await renderHeights();
  const step = screen.getByRole("button", { name: "Step" });

  for (let index = 0; index < keys.length; index += 1) await step.click();

  await expect
    .element(
      screen.getByText(
        "8's left subtree has height 2 and its right subtree has height 2, so its height is 1 + max(2, 2) = 3. That's the height of the whole tree.",
      ),
    )
    .toBeVisible();
  await expect.element(step).toHaveAttribute("aria-disabled", "true");
  expect(heightsSoFar(screen.container)).toEqual([
    "2: 1",
    "6: 1",
    "4: 2",
    "10: 1",
    "14: 1",
    "12: 2",
    "8: 3",
  ]);
});

it("goes back one node and resets to the start", async () => {
  const screen = await renderHeights();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await step.click();
  await screen.getByRole("button", { name: "Back" }).click();
  expect(heightsSoFar(screen.container)).toEqual(["2: 1"]);

  await screen.getByRole("button", { name: "Reset" }).click();
  await expect.element(screen.getByText("Press Step to start.")).toBeVisible();
});
