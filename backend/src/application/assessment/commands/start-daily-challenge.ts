import type { DailyChallengeStateResponse } from "@shared/schemas";
import {
  type DailyChallengeDependencies,
  makeLoadDailyChallengeState,
} from "@/application/assessment/daily-challenge-state";
import { generateQuestion } from "@/application/assessment/generate-draft";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { DailyChallenge } from "@/domain/assessment/daily-challenge";
import { ConflictError, NotFoundError } from "@/domain/errors";

export type StartDailyChallengeResult = {
  created: boolean;
  response: DailyChallengeStateResponse;
};

export const makeStartDailyChallenge = (dependencies: DailyChallengeDependencies) => {
  const { clock, getTodaysChallenge, assessmentAttemptRepository, questionRepository, logger } =
    dependencies;
  const loadState = makeLoadDailyChallengeState(dependencies);

  const createAttempt = async (
    userId: string,
    challenge: DailyChallenge,
  ): Promise<AssessmentAttempt> => {
    const question = await questionRepository.findById(challenge.questionId);
    if (!question)
      throw new NotFoundError("Question not found", { questionId: challenge.questionId });
    const generated = generateQuestion(logger, question, challenge.seed, question.difficulty);
    return assessmentAttemptRepository.createWithQuestions(
      {
        userId,
        kind: "daily_challenge",
        dailyChallengeId: challenge.id,
        startedAt: clock.now(),
      },
      [
        {
          questionId: question.id,
          position: 1,
          seed: challenge.seed,
          generatedQuestion: generated,
          difficulty: question.difficulty,
        },
      ],
    );
  };

  return async (): Promise<StartDailyChallengeResult> => {
    const userId = getSignedInUserId();
    const challenge = await getTodaysChallenge();
    const existing = await assessmentAttemptRepository.findByUserAndDailyChallenge(
      userId,
      challenge.id,
    );
    if (existing) {
      return { created: false, response: { data: await loadState(challenge, existing) } };
    }

    try {
      const attempt = await createAttempt(userId, challenge);
      return { created: true, response: { data: await loadState(challenge, attempt) } };
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
      const winner = await assessmentAttemptRepository.findByUserAndDailyChallenge(
        userId,
        challenge.id,
      );
      if (!winner) throw error;
      return { created: false, response: { data: await loadState(challenge, winner) } };
    }
  };
};

export type StartDailyChallenge = ReturnType<typeof makeStartDailyChallenge>;
