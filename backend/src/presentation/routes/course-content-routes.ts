import { Hono } from "hono";

import type { CourseContentController } from "@/presentation/controllers/course-content-controller";

export const createCourseContentRoutes = (courseContentController: CourseContentController) =>
  new Hono()
    .get("/learning-styles", (context) => courseContentController.listLearningStyles(context))
    .get("/code-languages", (context) => courseContentController.listCodeLanguages(context));
