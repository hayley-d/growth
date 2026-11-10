import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { LearningPathLesson } from "@shared/schemas";
import { LessonSheet } from "@/components/molecules/lesson-sheet";

const lesson = (changes: Partial<LearningPathLesson>): LearningPathLesson => ({
  id: "00000000-0000-4000-8000-000000000003",
  title: "In-order",
  summary: "Visit the left subtree, then the node, then the right subtree.",
  kind: "lesson",
  position: 3,
  status: "current",
  ...changes,
});

const handlers = () => ({
  onClose: vi.fn(),
  onStart: vi.fn(),
  onReview: vi.fn(),
  onTakeTest: vi.fn(),
});

it("shows the unit, title, summary and badge", async () => {
  const screen = await render(
    <LessonSheet lesson={lesson({})} unitLabel="Unit 1 · Binary trees" {...handlers()} />,
  );

  await expect.element(screen.getByText("Unit 1 · Binary trees")).toBeVisible();
  await expect.element(screen.getByRole("heading", { name: "In-order" })).toBeVisible();
  await expect
    .element(screen.getByText("Visit the left subtree, then the node, then the right subtree."))
    .toBeVisible();
  await expect.element(screen.getByText("Up next")).toBeVisible();
});

it("reviews a completed lesson", async () => {
  const actions = handlers();
  const screen = await render(
    <LessonSheet lesson={lesson({ status: "completed" })} unitLabel="Unit 1" {...actions} />,
  );

  await screen.getByRole("button", { name: "Review lesson" }).click();

  expect(actions.onReview).toHaveBeenCalledWith("00000000-0000-4000-8000-000000000003");
  expect(actions.onStart).not.toHaveBeenCalled();
});

it("starts the lesson that is up next", async () => {
  const actions = handlers();
  const screen = await render(<LessonSheet lesson={lesson({})} unitLabel="Unit 1" {...actions} />);

  await screen.getByRole("button", { name: "Start lesson" }).click();

  expect(actions.onStart).toHaveBeenCalledWith("00000000-0000-4000-8000-000000000003");
});

it("says start quiz for a checkpoint", async () => {
  const screen = await render(
    <LessonSheet lesson={lesson({ kind: "checkpoint" })} unitLabel="Unit 1" {...handlers()} />,
  );

  await expect.element(screen.getByRole("button", { name: "Start quiz" })).toBeVisible();
});

it("offers the test to skip ahead on a locked lesson", async () => {
  const actions = handlers();
  const screen = await render(
    <LessonSheet lesson={lesson({ status: "locked" })} unitLabel="Unit 1" {...actions} />,
  );

  await expect
    .element(screen.getByText("Passing the test completes every earlier lesson."))
    .toBeVisible();
  await screen.getByRole("button", { name: "Take the test to skip ahead" }).click();

  expect(actions.onTakeTest).toHaveBeenCalledWith("00000000-0000-4000-8000-000000000003");
});

it("uses its own line for a locked quiz", async () => {
  const screen = await render(
    <LessonSheet
      lesson={lesson({ status: "locked", kind: "checkpoint" })}
      unitLabel="Unit 1"
      {...handlers()}
    />,
  );

  await expect
    .element(screen.getByText("Pass it and every lesson before it counts as done."))
    .toBeVisible();
});

it("disables the button while starting and shows an error", async () => {
  const screen = await render(
    <LessonSheet
      lesson={lesson({})}
      unitLabel="Unit 1"
      isStarting
      errorMessage="Unable to start the lesson"
      {...handlers()}
    />,
  );

  await expect.element(screen.getByRole("button", { name: "Starting..." })).toBeDisabled();
  await expect.element(screen.getByRole("alert")).toHaveTextContent("Unable to start the lesson");
});

it("renders nothing when there is no lesson", async () => {
  const screen = await render(<LessonSheet lesson={null} unitLabel="" {...handlers()} />);

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

it("closes from the close button", async () => {
  const actions = handlers();
  const screen = await render(<LessonSheet lesson={lesson({})} unitLabel="Unit 1" {...actions} />);

  await screen.getByRole("button", { name: "Close" }).click();

  expect(actions.onClose).toHaveBeenCalled();
});
