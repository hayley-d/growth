import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { CopyTree } from "@/components/organisms/copy-tree";
import "@/index.css";

const keys = [8, 4, 12, 2, 6, 10, 14];
const caption = "Each node goes into the copy after its parent.";

const renderCopy = () =>
  render(
    <div className="w-[640px]">
      <CopyTree startingKeys={keys} caption={caption} />
    </div>,
  );

const copyOrder = (container: HTMLElement) =>
  [...container.querySelectorAll("ol[aria-label='Copy order'] li")].map((item) => item.textContent);

it("starts with nothing copied", async () => {
  const screen = await renderCopy();

  await expect.element(screen.getByText("Press Step to start copying.")).toBeVisible();
  await expect.element(screen.getByText(caption)).toBeVisible();
  await expect.element(screen.getByText("0 of 7")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Back" }))
    .toHaveAttribute("aria-disabled", "true");
  expect(copyOrder(screen.container)).toEqual([]);
});

it("copies the root first, then each node under its parent", async () => {
  const screen = await renderCopy();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await expect.element(screen.getByText("Copy 8 first. It's the root.")).toBeVisible();

  await step.click();
  await step.click();
  await expect.element(screen.getByText("Copy 2 under 4.")).toBeVisible();
  await expect.element(screen.getByText("3 of 7")).toBeVisible();
  expect(copyOrder(screen.container)).toEqual(["8", "4", "2"]);
});

it("shows the original and the copy as two trees", async () => {
  const screen = await renderCopy();

  await expect.element(screen.getByText("Original", { exact: true })).toBeVisible();
  await expect.element(screen.getByText("Copy", { exact: true })).toBeVisible();
  await screen.getByRole("button", { name: "Step" }).click();
  await screen.getByRole("button", { name: "Step" }).click();

  await expect.element(screen.getByRole("img", { name: "Original tree" })).toBeVisible();
  await expect.element(screen.getByRole("img", { name: "Copy so far: 8, 4" })).toBeVisible();
});

it("says when the copy is done and stops at the last node", async () => {
  const screen = await renderCopy();
  const step = screen.getByRole("button", { name: "Step" });

  for (let index = 0; index < keys.length; index += 1) await step.click();

  await expect.element(screen.getByText("Copy 14 under 12. All 7 nodes are copied.")).toBeVisible();
  await expect.element(step).toHaveAttribute("aria-disabled", "true");
  expect(copyOrder(screen.container)).toEqual(["8", "4", "2", "6", "12", "10", "14"]);
});

it("goes back one node and resets to the start", async () => {
  const screen = await renderCopy();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await step.click();
  await screen.getByRole("button", { name: "Back" }).click();
  await expect.element(screen.getByText("Copy 8 first. It's the root.")).toBeVisible();

  await screen.getByRole("button", { name: "Reset" }).click();
  await expect.element(screen.getByText("Press Step to start copying.")).toBeVisible();
});

it("moves with the arrow keys", async () => {
  const screen = await renderCopy();

  await screen.getByRole("button", { name: "Step" }).click();
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(screen.getByText("Copy 4 under 8.")).toBeVisible();
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(screen.getByText("Copy 8 first. It's the root.")).toBeVisible();
});
