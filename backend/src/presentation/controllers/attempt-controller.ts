import type { Context } from "hono";

import type { IdParam, RequestHintRequest, SubmitAnswerRequest } from "@shared/schemas";
import type { RequestHint } from "@/application/assessment/commands/request-hint";
import type { StartAttempt } from "@/application/assessment/commands/start-attempt";
import type { SubmitAnswer } from "@/application/assessment/commands/submit-answer";
import type { GetAttempt } from "@/application/assessment/queries/get-attempt";

type AttemptControllerDependencies = {
  startAttempt: StartAttempt;
  getAttempt: GetAttempt;
  requestHint: RequestHint;
  submitAnswer: SubmitAnswer;
};

type ParamContext = Context<object, string, { out: { param: IdParam } }>;
type HintContext = Context<object, string, { out: { param: IdParam; json: RequestHintRequest } }>;
type AnswerContext = Context<
  object,
  string,
  { out: { param: IdParam; json: SubmitAnswerRequest } }
>;

export const createAttemptController = ({
  startAttempt,
  getAttempt,
  requestHint,
  submitAnswer,
}: AttemptControllerDependencies) => ({
  start: async (context: ParamContext) => {
    const { created, response } = await startAttempt(context.req.valid("param"));
    return context.json(response, created ? 201 : 200);
  },
  get: async (context: ParamContext) => context.json(await getAttempt(context.req.valid("param"))),
  hint: async (context: HintContext) =>
    context.json(
      await requestHint({ ...context.req.valid("param"), ...context.req.valid("json") }),
    ),
  answer: async (context: AnswerContext) =>
    context.json(
      await submitAnswer({ ...context.req.valid("param"), ...context.req.valid("json") }),
    ),
});

export type AttemptController = ReturnType<typeof createAttemptController>;
