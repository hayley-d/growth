import type { Context } from "hono";

import type { AlgorithmParams, AlgorithmSnippetQuery } from "@shared/schemas/algorithm";
import type { GetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import type { ListAlgorithms } from "@/application/course-content/queries/list-algorithms";

type AlgorithmControllerDependencies = {
  listAlgorithms: ListAlgorithms;
  getAlgorithmSnippet: GetAlgorithmSnippet;
};

type SnippetContext = Context<
  object,
  string,
  { out: { param: AlgorithmParams; query: AlgorithmSnippetQuery } }
>;

export const createAlgorithmController = ({
  listAlgorithms,
  getAlgorithmSnippet,
}: AlgorithmControllerDependencies) => ({
  list: async (context: Context) => context.json(await listAlgorithms()),
  getSnippet: async (context: SnippetContext) =>
    context.json(
      await getAlgorithmSnippet({
        ...context.req.valid("param"),
        ...context.req.valid("query"),
      }),
    ),
});

export type AlgorithmController = ReturnType<typeof createAlgorithmController>;
