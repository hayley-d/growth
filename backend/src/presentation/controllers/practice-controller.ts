import type { Context } from "hono";

import type { IdParam, StartPracticeRequest } from "@shared/schemas";
import type { FinishPractice } from "@/application/assessment/commands/finish-practice";
import type { NextPracticeQuestion } from "@/application/assessment/commands/next-practice-question";
import type { StartPractice } from "@/application/assessment/commands/start-practice";
import type { GetPracticeTopics } from "@/application/assessment/queries/get-practice-topics";

type PracticeControllerDependencies = {
  getPracticeTopics: GetPracticeTopics;
  startPractice: StartPractice;
  nextPracticeQuestion: NextPracticeQuestion;
  finishPractice: FinishPractice;
};

type PlainContext = Context;
type StartContext = Context<object, string, { out: { json: StartPracticeRequest } }>;
type ParamContext = Context<object, string, { out: { param: IdParam } }>;

export const createPracticeController = ({
  getPracticeTopics,
  startPractice,
  nextPracticeQuestion,
  finishPractice,
}: PracticeControllerDependencies) => ({
  topics: async (context: PlainContext) => context.json(await getPracticeTopics()),
  start: async (context: StartContext) =>
    context.json(await startPractice(context.req.valid("json")), 201),
  next: async (context: ParamContext) =>
    context.json(await nextPracticeQuestion(context.req.valid("param"))),
  finish: async (context: ParamContext) =>
    context.json(await finishPractice(context.req.valid("param"))),
});

export type PracticeController = ReturnType<typeof createPracticeController>;
