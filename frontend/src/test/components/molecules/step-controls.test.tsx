import { beforeEach, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { StepControls } from "@/components/molecules/step-controls";
import type { StepPhase } from "@/lib/step-phases";
import { useStepPlayer } from "@/lib/use-step-player";
import { usePlaybackStore } from "@/stores/playback-store";

const phases: readonly StepPhase[] = ["walk", "walk", "height", "rebalance", "rotate"];

function Player() {
  const player = useStepPlayer(phases);
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

it("turns off the buttons that can't go further at each end", async () => {
  const screen = await render(<Player />);

  await expect.element(screen.getByRole("button", { name: "First step" })).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Back one step" })).toBeDisabled();

  await screen.getByRole("button", { name: "Last step" }).click();

  await expect.element(screen.getByRole("button", { name: "Forward one step" })).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Last step" })).toBeDisabled();
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
