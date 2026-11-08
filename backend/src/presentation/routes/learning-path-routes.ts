import { Hono } from "hono";

import type { LearningPathController } from "@/presentation/controllers/learning-path-controller";
import { requireAuth } from "@/presentation/middleware/require-role";

export const createLearningPathRoutes = (learningPathController: LearningPathController) =>
  new Hono().use(requireAuth).get("/", (context) => learningPathController.get(context));
