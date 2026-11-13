import type { DailyChallengeStateResponse } from "@shared/schemas";
import {
  type DailyChallengeDependencies,
  makeLoadDailyChallengeState,
} from "@/application/assessment/daily-challenge-state";
import { getSignedInUserId } from "@/application/lesson/lesson-access";

export const makeGetDailyChallenge = (dependencies: DailyChallengeDependencies) => {
  const { getTodaysChallenge, assessmentAttemptRepository } = dependencies;
  const loadState = makeLoadDailyChallengeState(dependencies);

  return async (): Promise<DailyChallengeStateResponse> => {
    const userId = getSignedInUserId();
    const challenge = await getTodaysChallenge();
    const attempt = await assessmentAttemptRepository.findByUserAndDailyChallenge(
      userId,
      challenge.id,
    );
    return { data: await loadState(challenge, attempt) };
  };
};

export type GetDailyChallenge = ReturnType<typeof makeGetDailyChallenge>;
