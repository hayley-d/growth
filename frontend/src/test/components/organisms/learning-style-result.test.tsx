import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { LearningStyleResult } from "@/components/organisms/learning-style-result";

const learningStyles = [
  { id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80", name: "Visual", description: "Diagrams." },
  { id: "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80", name: "Auditory", description: "Listening." },
];
const [visual, auditory] = learningStyles as [
  (typeof learningStyles)[number],
  (typeof learningStyles)[number],
];

const renderResult = (selectedId: string, onSelect = vi.fn(), onBack = vi.fn()) =>
  render(
    <LearningStyleResult
      scoredId={visual.id}
      selectedId={selectedId}
      learningStyles={learningStyles}
      onSelect={onSelect}
      onBack={onBack}
      action={<button type="button">Next</button>}
    />,
  );

it("names the style, says what it changes and marks it chosen", async () => {
  const screen = await renderResult(visual.id);

  await expect.element(screen.getByRole("heading", { name: "Visual", level: 2 })).toBeVisible();
  await expect.element(screen.getByText("Diagrams.")).toBeVisible();
  await expect.element(screen.getByText(/made for visual learners/)).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Visual" }))
    .toHaveAttribute("aria-pressed", "true");
  await expect.element(screen.getByText("The quiz suggested Visual.")).not.toBeInTheDocument();
});

it("lets the learner pick a different style and go back", async () => {
  const onSelect = vi.fn();
  const onBack = vi.fn();
  const screen = await renderResult(visual.id, onSelect, onBack);

  await screen.getByRole("button", { name: "Auditory" }).click();
  await screen.getByRole("button", { name: "Back" }).click();

  expect(onSelect).toHaveBeenCalledWith(auditory.id);
  expect(onBack).toHaveBeenCalled();
});

it("says what the quiz suggested when the learner picked another style", async () => {
  const screen = await renderResult(auditory.id);

  await expect.element(screen.getByRole("heading", { name: "Auditory", level: 2 })).toBeVisible();
  await expect.element(screen.getByText("The quiz suggested Visual.")).toBeVisible();
});
