import type { Context } from "hono";

import type { CompleteOnboardingRequest, ScoreQuizRequest } from "@shared/schemas";
import type { GetQuiz } from "@/application/onboarding/queries/get-quiz";
import type { ScoreQuiz } from "@/application/onboarding/queries/score-quiz";
import type { CompleteOnboarding } from "@/application/user/commands/complete-onboarding";

type OnboardingControllerDependencies = {
  getQuiz: GetQuiz;
  scoreQuiz: ScoreQuiz;
  completeOnboarding: CompleteOnboarding;
};

type CompleteOnboardingContext = Context<
  object,
  string,
  { out: { json: CompleteOnboardingRequest } }
>;

type ScoreQuizContext = Context<object, string, { out: { json: ScoreQuizRequest } }>;

export const createOnboardingController = ({
  getQuiz,
  scoreQuiz,
  completeOnboarding,
}: OnboardingControllerDependencies) => ({
  getQuiz: async (context: Context) => context.json(await getQuiz()),
  scoreQuiz: async (context: ScoreQuizContext) =>
    context.json(await scoreQuiz(context.req.valid("json"))),
  completeOnboarding: async (context: CompleteOnboardingContext) =>
    context.json(await completeOnboarding(context.req.valid("json"))),
});

export type OnboardingController = ReturnType<typeof createOnboardingController>;
