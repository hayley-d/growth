import { Hono } from "hono";

import { algorithmParamsSchema, algorithmSnippetQuerySchema } from "@shared/schemas/algorithm";
import type { AlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { validate } from "@/presentation/middleware/validate-request";

export const createAlgorithmRoutes = (algorithmController: AlgorithmController) =>
  new Hono()
    .get("/", (context) => algorithmController.list(context))
    .get(
      "/:code/snippet",
      validate("param", algorithmParamsSchema),
      validate("query", algorithmSnippetQuerySchema),
      (context) => algorithmController.getSnippet(context),
    );
