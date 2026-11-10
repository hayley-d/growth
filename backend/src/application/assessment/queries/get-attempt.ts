import type { AttemptStateResponse, IdParam } from "@shared/schemas";
import { makeResolveOwnedAttempt } from "@/application/assessment/attempt-access";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { makeLoadAttemptState } from "@/application/assessment/attempt-state";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";

type GetAttemptDependencies = AttemptStateDependencies & {
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "findById" | "update">;
};

export const makeGetAttempt = (dependencies: GetAttemptDependencies) => {
  const resolveOwnedAttempt = makeResolveOwnedAttempt(dependencies);
  const loadAttemptState = makeLoadAttemptState(dependencies);

  return async ({ id }: IdParam): Promise<AttemptStateResponse> => ({
    data: await loadAttemptState(await resolveOwnedAttempt(id)),
  });
};

export type GetAttempt = ReturnType<typeof makeGetAttempt>;
