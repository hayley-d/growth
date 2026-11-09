import { Hono } from "hono";

import {
  idParamSchema,
  requestHintRequestSchema,
  submitAnswerRequestSchema,
} from "@shared/schemas";
import type { AttemptController } from "@/presentation/controllers/attempt-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createAttemptRoutes = (attemptController: AttemptController) =>
  new Hono()
    .post("/lessons/:id/attempts", requireAuth, validate("param", idParamSchema), (context) =>
      attemptController.start(context),
    )
    .get("/attempts/:id", requireAuth, validate("param", idParamSchema), (context) =>
      attemptController.get(context),
    )
    .post(
      "/attempts/:id/hints",
      requireAuth,
      validate("param", idParamSchema),
      validate("json", requestHintRequestSchema),
      (context) => attemptController.hint(context),
    )
    .post(
      "/attempts/:id/answers",
      requireAuth,
      validate("param", idParamSchema),
      validate("json", submitAnswerRequestSchema),
      (context) => attemptController.answer(context),
    );
