import type { AttemptStateResponse, StartPracticeRequest } from "@shared/schemas";
import {
  makeEnsurePracticeQuestion,
  makePracticePool,
  type PracticeDependencies,
} from "@/application/assessment/practice-session";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { ConflictError } from "@/domain/errors";

export const makeStartPractice = (dependencies: PracticeDependencies) => {
  const { assessmentAttemptRepository } = dependencies;
  const ensureQuestion = makeEnsurePracticeQuestion(dependencies);
  const listPool = makePracticePool(dependencies);

  return async ({ topic }: StartPracticeRequest): Promise<AttemptStateResponse> => {
    const userId = getSignedInUserId();
    if ((await listPool(userId, topic)).length === 0) {
      throw new ConflictError("No questions for this topic yet", { topic });
    }

    const existing = await assessmentAttemptRepository.findUnfinishedPractice(userId);
    if (existing) await assessmentAttemptRepository.update(existing.id, { finishedAt: new Date() });

    const attempt = await assessmentAttemptRepository.create({
      userId,
      kind: "practice",
      practiceTopic: topic,
    });
    return { data: await ensureQuestion(attempt) };
  };
};

export type StartPractice = ReturnType<typeof makeStartPractice>;
