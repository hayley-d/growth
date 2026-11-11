import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { UnitProgress } from "@/components/molecules/unit-progress";

const dotsOf = (element: Element) => Array.from(element.lastElementChild?.children ?? []);

const doneStates = (element: Element) =>
  dotsOf(element).map((dot) => dot.firstElementChild?.getAttribute("data-done"));

it("shows the unit title and its progress", async () => {
  const screen = await render(
    <UnitProgress title="AVL trees" progress={33} tone="accent" completed={2} total={6} />,
  );

  await expect.element(screen.getByText("AVL trees")).toBeVisible();
  await expect.element(screen.getByText("33%")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "AVL trees progress" }))
    .toHaveAttribute("aria-valuenow", "33");
});

it("fills one dot for each completed lesson", async () => {
  const screen = await render(
    <UnitProgress title="AVL trees" progress={33} tone="accent" completed={2} total={6} />,
  );

  expect(doneStates(screen.getByRole("progressbar").element())).toEqual([
    "true",
    "true",
    "false",
    "false",
    "false",
    "false",
  ]);
});

it("has no filled dots at 0", async () => {
  const screen = await render(
    <UnitProgress title="Empty" progress={0} tone="primary" completed={0} total={3} />,
  );

  expect(doneStates(screen.getByRole("progressbar").element())).toEqual([
    "false",
    "false",
    "false",
  ]);
});

it("has every dot filled at 100", async () => {
  const screen = await render(
    <UnitProgress title="Full" progress={100} tone="secondary" completed={3} total={3} />,
  );

  expect(doneStates(screen.getByRole("progressbar").element())).toEqual(["true", "true", "true"]);
});

it("draws no dots when there are no lessons", async () => {
  const screen = await render(
    <UnitProgress title="None" progress={0} tone="primary" completed={0} total={0} />,
  );

  expect(dotsOf(screen.getByRole("progressbar").element())).toHaveLength(0);
});
