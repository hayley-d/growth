import type { Context } from "hono";

import type { GetLearningPath } from "@/application/learning-path/queries/get-learning-path";

type LearningPathControllerDependencies = {
  getLearningPath: GetLearningPath;
};

export const createLearningPathController = ({
  getLearningPath,
}: LearningPathControllerDependencies) => ({
  get: async (context: Context) => context.json(await getLearningPath()),
});

export type LearningPathController = ReturnType<typeof createLearningPathController>;
