import type { AttemptStateResponse, IdParam } from "@shared/schemas";
import {
  makeEnsurePracticeQuestion,
  makeResolveOwnedPractice,
  type PracticeDependencies,
} from "@/application/assessment/practice-session";
import { ConflictError } from "@/domain/errors";

export const makeNextPracticeQuestion = (dependencies: PracticeDependencies) => {
  const resolveOwnedPractice = makeResolveOwnedPractice(dependencies);
  const ensureQuestion = makeEnsurePracticeQuestion(dependencies);

  return async ({ id }: IdParam): Promise<AttemptStateResponse> => {
    const attempt = await resolveOwnedPractice(id);
    if (attempt.finishedAt)
      throw new ConflictError("Attempt is already finished", { attemptId: id });
    return { data: await ensureQuestion(attempt) };
  };
};

export type NextPracticeQuestion = ReturnType<typeof makeNextPracticeQuestion>;
