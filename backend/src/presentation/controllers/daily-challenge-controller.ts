import type { Context } from "hono";

import type { SubmitAnswerRequest } from "@shared/schemas";
import type { StartDailyChallenge } from "@/application/assessment/commands/start-daily-challenge";
import type { SubmitDailyChallengeAnswer } from "@/application/assessment/commands/submit-daily-challenge-answer";
import type { GetDailyChallenge } from "@/application/assessment/queries/get-daily-challenge";

type DailyChallengeControllerDependencies = {
  getDailyChallenge: GetDailyChallenge;
  startDailyChallenge: StartDailyChallenge;
  submitDailyChallengeAnswer: SubmitDailyChallengeAnswer;
};

type AnswerContext = Context<object, string, { out: { json: SubmitAnswerRequest } }>;

export const createDailyChallengeController = ({
  getDailyChallenge,
  startDailyChallenge,
  submitDailyChallengeAnswer,
}: DailyChallengeControllerDependencies) => ({
  get: async (context: Context) => context.json(await getDailyChallenge()),
  start: async (context: Context) => {
    const { created, response } = await startDailyChallenge();
    return context.json(response, created ? 201 : 200);
  },
  answer: async (context: AnswerContext) =>
    context.json(await submitDailyChallengeAnswer(context.req.valid("json"))),
});

export type DailyChallengeController = ReturnType<typeof createDailyChallengeController>;
