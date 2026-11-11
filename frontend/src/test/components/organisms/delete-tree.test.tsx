import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DeleteTree } from "@/components/organisms/delete-tree";
import "@/index.css";

const keys = [8, 4, 12, 2, 6, 10, 14];
const caption = "Each node is deleted after its children.";

const renderDelete = () =>
  render(
    <div className="w-[640px]">
      <DeleteTree startingKeys={keys} caption={caption} />
    </div>,
  );

const deleteOrder = (container: HTMLElement) =>
  [...container.querySelectorAll("ol[aria-label='Delete order'] li")].map(
    (item) => item.textContent,
  );

const shownKeys = (container: HTMLElement) =>
  [...(container.querySelector("[role='img']")?.querySelectorAll("*") ?? [])]
    .filter((element) => element.children.length === 0 && element.textContent)
    .map((element) => element.textContent)
    .sort();

it("starts with the whole tree", async () => {
  const screen = await renderDelete();

  await expect.element(screen.getByText("Press Step to start deleting.")).toBeVisible();
  await expect.element(screen.getByText(caption)).toBeVisible();
  await expect.element(screen.getByText("0 of 7")).toBeVisible();
  await expect
    .element(screen.getByRole("img", { name: "Tree, nothing deleted yet" }))
    .toBeVisible();
  expect(deleteOrder(screen.container)).toEqual([]);
});

it("deletes the leaves first, then each parent once its children are gone", async () => {
  const screen = await renderDelete();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await expect.element(screen.getByText("Delete 2. It has no children.")).toBeVisible();

  await step.click();
  await step.click();
  await expect.element(screen.getByText("Delete 4. 2 and 6 are already gone.")).toBeVisible();
  await expect.element(screen.getByRole("img", { name: "Tree, deleting 4" })).toBeVisible();
  expect(deleteOrder(screen.container)).toEqual(["2", "6", "4"]);

  await step.click();
  await expect.poll(() => shownKeys(screen.container)).toEqual(["10", "12", "14", "8"]);
});

it("says when the tree is gone and stops at the root", async () => {
  const screen = await renderDelete();
  const step = screen.getByRole("button", { name: "Step" });

  for (let index = 0; index < keys.length; index += 1) await step.click();

  await expect
    .element(screen.getByText("Delete 8. 4 and 12 are already gone. All 7 nodes are deleted."))
    .toBeVisible();
  await expect.element(step).toHaveAttribute("aria-disabled", "true");
  expect(deleteOrder(screen.container)).toEqual(["2", "6", "4", "10", "14", "12", "8"]);
});

it("goes back one node and resets to the start", async () => {
  const screen = await renderDelete();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await step.click();
  await screen.getByRole("button", { name: "Back" }).click();
  await expect.element(screen.getByText("Delete 2. It has no children.")).toBeVisible();

  await screen.getByRole("button", { name: "Reset" }).click();
  await expect.element(screen.getByText("Press Step to start deleting.")).toBeVisible();
});
