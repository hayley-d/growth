import { Hono } from "hono";

import { idParamSchema, startPracticeRequestSchema } from "@shared/schemas";
import type { PracticeController } from "@/presentation/controllers/practice-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createPracticeRoutes = (practiceController: PracticeController) =>
  new Hono()
    .get("/practice/topics", requireAuth, (context) => practiceController.topics(context))
    .post(
      "/practice/attempts",
      requireAuth,
      validate("json", startPracticeRequestSchema),
      (context) => practiceController.start(context),
    )
    .post(
      "/practice/attempts/:id/questions",
      requireAuth,
      validate("param", idParamSchema),
      (context) => practiceController.next(context),
    )
    .post(
      "/practice/attempts/:id/finish",
      requireAuth,
      validate("param", idParamSchema),
      (context) => practiceController.finish(context),
    );
