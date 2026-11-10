import { describe, expect, it } from "vitest";

import { ConflictError, NotFoundError } from "@/domain/errors";
import { asLearner, asUser } from "@/test/application/assessment/attempt-fakes";
import { answerAll, createUseCases, startFor } from "@/test/application/assessment/attempt-helpers";

const hint = (useCases: ReturnType<typeof createUseCases>, attemptId: string, questionId: string) =>
  asLearner(() => useCases.requestHint({ id: attemptId, questionId }));

describe("makeRequestHint", () => {
  it("returns hints one at a time and counts them", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    const questionId = state.question?.id ?? "";
    const first = await hint(useCases, state.attempt.id, questionId);
    expect(first.data).toMatchObject({
      questionId,
      hint: "Hint one",
      hintNumber: 1,
      hintsRemaining: 1,
    });
    const second = await hint(useCases, state.attempt.id, questionId);
    expect(second.data).toMatchObject({ hint: "Hint two", hintNumber: 2, hintsRemaining: 0 });
    expect(useCases.world.attemptQuestions[0]?.hintsUsed).toBe(2);
  });

  it("keeps unlocked hints in the question when the attempt is read again", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    expect(state.question).toMatchObject({ hints: [], hintsTotal: 2, hintsRemaining: 2 });
    await hint(useCases, state.attempt.id, state.question?.id ?? "");
    const again = await asLearner(() => useCases.getAttempt({ id: state.attempt.id }));
    expect(again.data.question).toMatchObject({ hints: ["Hint one"], hintsRemaining: 1 });
  });

  it("returns 409 when no hints are left", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    const questionId = state.question?.id ?? "";
    await hint(useCases, state.attempt.id, questionId);
    await hint(useCases, state.attempt.id, questionId);
    await expect(hint(useCases, state.attempt.id, questionId)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("returns 409 when the hint was taken by a parallel request", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    useCases.world.dependencies.attemptQuestionRepository.takeHint.mockResolvedValueOnce(false);
    await expect(hint(useCases, state.attempt.id, state.question?.id ?? "")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("returns 409 for a question that is not the current one", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    const later = useCases.world.attemptQuestions.find((row) => row.position === 2);
    await expect(hint(useCases, state.attempt.id, later?.id ?? "")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("returns 409 once the attempt is finished", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    await answerAll(useCases, state.attempt.id);
    await expect(
      hint(useCases, state.attempt.id, useCases.world.attemptQuestions[0]?.id ?? ""),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("returns 404 for another learner's attempt", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    await expect(
      asUser("user-2", () =>
        useCases.requestHint({ id: state.attempt.id, questionId: state.question?.id ?? "" }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("gives a generated question its three hints", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await answerAll(useCases, state.attempt.id);
    const generated = useCases.world.attemptQuestions.find(
      (row) => row.questionId === "q-generated",
    );
    expect(generated?.generatedQuestion).toMatchObject({ hints: expect.any(Array) });
  });
});
