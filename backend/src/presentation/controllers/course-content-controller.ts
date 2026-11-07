import type { Context } from "hono";

import type { ListCodeLanguages } from "@/application/course-content/queries/list-code-languages";
import type { ListLearningStyles } from "@/application/course-content/queries/list-learning-styles";

type CourseContentControllerDependencies = {
  listLearningStyles: ListLearningStyles;
  listCodeLanguages: ListCodeLanguages;
};

export const createCourseContentController = ({
  listLearningStyles,
  listCodeLanguages,
}: CourseContentControllerDependencies) => ({
  listLearningStyles: async (context: Context) => context.json(await listLearningStyles()),
  listCodeLanguages: async (context: Context) => context.json(await listCodeLanguages()),
});

export type CourseContentController = ReturnType<typeof createCourseContentController>;
