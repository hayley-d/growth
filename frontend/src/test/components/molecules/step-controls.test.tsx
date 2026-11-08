import { beforeEach, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { StepControls } from "@/components/molecules/step-controls";
import type { StepPhase } from "@/lib/step-phases";
import { useStepPlayer } from "@/lib/use-step-player";
import { usePlaybackStore } from "@/stores/playback-store";

const phases: readonly StepPhase[] = ["walk", "walk", "height", "rebalance", "rotate"];

function Player() {
  const player = useStepPlayer(phases, "run");
  return (
    <>
      <StepControls player={player} phases={phases} />
      <p>Showing {player.index + 1}</p>
    </>
  );
}

beforeEach(() => {
  usePlaybackStore.setState({ speed: 1 });
});

it("labels every button and says which step is showing", async () => {
  const screen = await render(<Player />);

  for (const name of ["First step", "Back one step", "Play", "Forward one step", "Last step"]) {
    await expect.element(screen.getByRole("button", { name })).toBeInTheDocument();
  }
  await expect.element(screen.getByText("Step 1 of 5", { exact: true })).toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Step 3 of 5, Update height" }))
    .toBeInTheDocument();
});

it("marks the buttons that can't go further at each end", async () => {
  const screen = await render(<Player />);

  await expect
    .element(screen.getByRole("button", { name: "First step" }))
    .toHaveAttribute("aria-disabled", "true");
  await expect
    .element(screen.getByRole("button", { name: "Back one step" }))
    .toHaveAttribute("aria-disabled", "true");

  await screen.getByRole("button", { name: "Last step" }).click();

  await expect
    .element(screen.getByRole("button", { name: "Forward one step" }))
    .toHaveAttribute("aria-disabled", "true");
  await expect
    .element(screen.getByRole("button", { name: "Last step" }))
    .toHaveAttribute("aria-disabled", "true");
  await expect.element(screen.getByText("Showing 5")).toBeInTheDocument();
});

it("jumps to a step when its dot is tapped", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Step 4 of 5, Rebalance" }).click();

  await expect.element(screen.getByText("Showing 4")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Step 4 of 5, Rebalance" }))
    .toHaveAttribute("aria-current", "step");
});

it("only lists the phases in this run in the key", async () => {
  const screen = await render(<Player />);
  const key = screen.getByRole("list", { name: "Key" });

  await expect.element(key.getByText("Walk the tree")).toBeInTheDocument();
  await expect.element(key.getByText("Rotate")).toBeInTheDocument();
});

it("saves the speed the learner picks", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("radio", { name: "2×" }).click();

  expect(usePlaybackStore.getState().speed).toBe(2);
  await expect.element(screen.getByRole("radio", { name: "2×" })).toBeChecked();
});

it("steps with the arrow keys and plays with Space", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Step 1 of 5, Walk the tree" }).click();
  await userEvent.keyboard("{ArrowRight}{ArrowRight}");
  await expect.element(screen.getByText("Showing 3")).toBeInTheDocument();

  await screen.getByRole("button", { name: "Forward one step" }).click();
  await expect.element(screen.getByText("Showing 4")).toBeInTheDocument();
  await userEvent.keyboard(" ");

  await expect.element(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  await expect.element(screen.getByText("Showing 4")).toBeInTheDocument();
});

it("keeps the keys working after reaching either end", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Forward one step" }).click();
  await userEvent.keyboard("{End}");
  await expect.element(screen.getByText("Showing 5")).toBeInTheDocument();

  await userEvent.keyboard("{Home}");
  await expect.element(screen.getByText("Showing 1")).toBeInTheDocument();

  await userEvent.keyboard("{ArrowRight}");
  await expect.element(screen.getByText("Showing 2")).toBeInTheDocument();
});

it("keeps focus on the Last step button after it is used", async () => {
  const screen = await render(<Player />);
  const lastButton = screen.getByRole("button", { name: "Last step" });

  await lastButton.click();
  await expect.element(lastButton).toHaveFocus();

  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(screen.getByText("Showing 4")).toBeInTheDocument();
});

it("lets only the current dot take Tab focus", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Step 3 of 5, Update height" }).click();

  const tabbableDots = document.querySelectorAll('[data-step][tabindex="0"]');
  expect(tabbableDots).toHaveLength(1);
  expect(tabbableDots[0]?.getAttribute("data-step")).toBe("2");
});

it("moves focus along the dots with the arrow keys", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Step 1 of 5, Walk the tree" }).click();
  await userEvent.keyboard("{ArrowRight}");

  await expect
    .element(screen.getByRole("button", { name: "Step 2 of 5, Walk the tree" }))
    .toHaveFocus();
});

it("shows a pin with the step number over the current dot", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("button", { name: "Step 4 of 5, Rebalance" }).click();

  await expect.element(screen.getByText("4 of 5", { exact: true })).toBeVisible();
});

it("leaves the arrow keys to the speed picker", async () => {
  const screen = await render(<Player />);

  await screen.getByRole("radio", { name: "1×" }).click();
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(screen.getByRole("radio", { name: "2×" })).toBeChecked();
  await expect.element(screen.getByText("Showing 1")).toBeInTheDocument();
});
