import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { StepButtons } from "@/components/molecules/step-buttons";
import "@/index.css";

const playerAt = (index: number, isFirst: boolean, isLast: boolean) => ({
  index,
  isFirst,
  isLast,
  first: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
});

it("shows how far along the player is", async () => {
  const screen = await render(<StepButtons player={playerAt(3, false, false)} total={7} />);

  await expect.element(screen.getByText("3 of 7")).toBeVisible();
});

it("calls the player for each button", async () => {
  const player = playerAt(3, false, false);
  const screen = await render(<StepButtons player={player} total={7} />);

  await screen.getByRole("button", { name: "Reset" }).click();
  await screen.getByRole("button", { name: "Back" }).click();
  await screen.getByRole("button", { name: "Step" }).click();

  expect(player.first).toHaveBeenCalledOnce();
  expect(player.back).toHaveBeenCalledOnce();
  expect(player.forward).toHaveBeenCalledOnce();
});

it("marks Back and Step as unavailable at the ends without disabling them", async () => {
  const start = await render(<StepButtons player={playerAt(0, true, false)} total={7} />);
  await expect
    .element(start.getByRole("button", { name: "Back" }))
    .toHaveAttribute("aria-disabled", "true");
  await expect.element(start.getByRole("button", { name: "Back" })).not.toHaveAttribute("disabled");
  start.unmount();

  const end = await render(<StepButtons player={playerAt(7, false, true)} total={7} />);
  await expect
    .element(end.getByRole("button", { name: "Step" }))
    .toHaveAttribute("aria-disabled", "true");
});
