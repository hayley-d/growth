import type { Attempt, AttemptQuestion as AttemptQuestionResponse } from "@shared/schemas";
import type { QuestionView } from "@/application/assessment/question-view";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AttemptQuestion } from "@/domain/assessment/attempt-question";
import { NotFoundError } from "@/domain/errors";

export const toAttempt = (
  attempt: AssessmentAttempt,
  total: number,
  answeredCount: number,
): Attempt => {
  if (!attempt.lessonId || (attempt.kind !== "lesson_test" && attempt.kind !== "checkpoint")) {
    throw new NotFoundError("Attempt not found", { attemptId: attempt.id });
  }
  return {
    id: attempt.id,
    lessonId: attempt.lessonId,
    kind: attempt.kind,
    status: attempt.finishedAt ? "finished" : "in_progress",
    total,
    answeredCount,
    startedAt: attempt.startedAt.toISOString(),
    finishedAt: attempt.finishedAt ? attempt.finishedAt.toISOString() : null,
  };
};

export const toAttemptQuestion = (
  attemptQuestion: AttemptQuestion,
  view: QuestionView,
): AttemptQuestionResponse => {
  const unlocked = Math.min(attemptQuestion.hintsUsed, view.hints.length);
  return {
    id: attemptQuestion.id,
    position: attemptQuestion.position,
    type: view.type,
    prompt: view.prompt,
    tree: view.tree,
    ...(view.options ? { options: view.options } : {}),
    difficulty: attemptQuestion.difficulty,
    hints: view.hints.slice(0, unlocked),
    hintsTotal: view.hints.length,
    hintsRemaining: view.hints.length - unlocked,
  };
};
