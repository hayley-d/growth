import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { LessonNode } from "@/components/atoms/lesson-node";
import "@/index.css";

it("names the lesson and its state", async () => {
  const screen = await render(
    <LessonNode
      title="In-order"
      status="completed"
      kind="lesson"
      unit="primary"
      onClick={vi.fn()}
    />,
  );

  await expect.element(screen.getByRole("button", { name: "In-order, completed" })).toBeVisible();
});

it("marks the up next lesson as the current step", async () => {
  const screen = await render(
    <LessonNode title="In-order" status="current" kind="lesson" unit="primary" onClick={vi.fn()} />,
  );

  await expect
    .element(screen.getByRole("button", { name: "In-order, up next" }))
    .toHaveAttribute("aria-current", "step");
});

it("only marks the current lesson", async () => {
  const screen = await render(
    <LessonNode title="Pre-order" status="locked" kind="lesson" unit="primary" onClick={vi.fn()} />,
  );

  await expect
    .element(screen.getByRole("button", { name: "Pre-order, locked" }))
    .not.toHaveAttribute("aria-current");
});

it("calls onClick when pressed", async () => {
  const onClick = vi.fn();
  const screen = await render(
    <LessonNode
      title="Pre-order"
      status="locked"
      kind="lesson"
      unit="secondary"
      onClick={onClick}
    />,
  );

  await screen.getByRole("button", { name: "Pre-order, locked" }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

it("is at least 44px in every state and draws quizzes as rounded squares", async () => {
  const screen = await render(
    <div>
      {(["completed", "current", "locked"] as const).map((status) => (
        <LessonNode
          key={status}
          title={`Lesson ${status}`}
          status={status}
          kind="checkpoint"
          unit="primary"
          onClick={vi.fn()}
        />
      ))}
    </div>,
  );

  for (const name of [
    "Lesson completed, quiz, completed",
    "Lesson current, quiz, up next",
    "Lesson locked, quiz, locked",
  ]) {
    const button = screen.getByRole("button", { name }).element();
    expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    expect(button.className).toContain("rounded-xl");
  }
});
