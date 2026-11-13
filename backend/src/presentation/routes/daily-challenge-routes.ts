import { Hono } from "hono";

import { submitAnswerRequestSchema } from "@shared/schemas";
import type { DailyChallengeController } from "@/presentation/controllers/daily-challenge-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createDailyChallengeRoutes = (dailyChallengeController: DailyChallengeController) =>
  new Hono()
    .get("/", requireAuth, (context) => dailyChallengeController.get(context))
    .post("/start", requireAuth, (context) => dailyChallengeController.start(context))
    .post("/answers", requireAuth, validate("json", submitAnswerRequestSchema), (context) =>
      dailyChallengeController.answer(context),
    );
