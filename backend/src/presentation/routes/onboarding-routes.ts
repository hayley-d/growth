import { Hono } from "hono";

import { completeOnboardingRequestSchema, scoreQuizRequestSchema } from "@shared/schemas";
import type { OnboardingController } from "@/presentation/controllers/onboarding-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createOnboardingRoutes = (onboardingController: OnboardingController) =>
  new Hono()
    .use(requireAuth)
    .post("/", validate("json", completeOnboardingRequestSchema), (context) =>
      onboardingController.completeOnboarding(context),
    )
    .get("/quiz", (context) => onboardingController.getQuiz(context))
    .post("/quiz", validate("json", scoreQuizRequestSchema), (context) =>
      onboardingController.scoreQuiz(context),
    );
