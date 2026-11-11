import { useState } from "react";
import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { QuizQuestion } from "@shared/schemas";
import { LearningStyleQuiz, type QuizAnswers } from "@/components/organisms/learning-style-quiz";
import "@/index.css";

const questions: QuizQuestion[] = [1, 2, 3].map((number) => ({
  id: `question-${number}`,
  prompt: `Question prompt ${number}`,
  options: ["a", "b", "c", "d"].map((id) => ({ id, text: `Option ${id} for ${number}` })),
}));

function Harness({
  initial = {},
  onComplete,
}: {
  initial?: QuizAnswers;
  onComplete: (answers: QuizAnswers) => void;
}) {
  const [answers, setAnswers] = useState(initial);
  return (
    <LearningStyleQuiz
      questions={questions}
      answers={answers}
      onAnswersChange={setAnswers}
      onComplete={onComplete}
    />
  );
}

it("shows one question at a time with its progress and no Back on the first", async () => {
  const screen = await render(<Harness onComplete={vi.fn()} />);

  await expect.element(screen.getByRole("heading", { name: "Question prompt 1" })).toBeVisible();
  await expect.element(screen.getByText("Question 1 of 3")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Question 1 of 3" }))
    .toHaveAttribute("aria-valuenow", "0");
  await expect.element(screen.getByRole("button", { name: "Back" })).not.toBeInTheDocument();
});

it("moves on after an answer and hands every answer over after the last one", async () => {
  const onComplete = vi.fn();
  const screen = await render(<Harness onComplete={onComplete} />);

  await screen.getByRole("button", { name: "Option b for 1" }).click();
  await screen.getByRole("button", { name: "Option c for 2" }).click();
  await expect.element(screen.getByRole("heading", { name: "Question prompt 3" })).toHaveFocus();
  await screen.getByRole("button", { name: "Option a for 3" }).click();

  expect(onComplete).toHaveBeenCalledWith({
    "question-1": "b",
    "question-2": "c",
    "question-3": "a",
  });
});

it("keeps earlier answers when going back", async () => {
  const screen = await render(<Harness onComplete={vi.fn()} />);

  await screen.getByRole("button", { name: "Option d for 1" }).click();
  await screen.getByRole("button", { name: "Back" }).click();

  await expect
    .element(screen.getByRole("button", { name: "Option d for 1" }))
    .toHaveAttribute("aria-pressed", "true");
  await expect
    .element(screen.getByRole("button", { name: "Option a for 1" }))
    .toHaveAttribute("aria-pressed", "false");
});

it("opens on the last question when every answer is already given", async () => {
  const screen = await render(
    <Harness
      initial={{ "question-1": "a", "question-2": "a", "question-3": "b" }}
      onComplete={vi.fn()}
    />,
  );

  await expect.element(screen.getByRole("heading", { name: "Question prompt 3" })).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Option b for 3" }))
    .toHaveAttribute("aria-pressed", "true");
});

it("keeps every option at least 44px tall on a phone", async () => {
  const screen = await render(<Harness onComplete={vi.fn()} />);

  const option = screen.getByRole("button", { name: "Option a for 1" }).element();
  expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
});
