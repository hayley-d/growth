import { Hono } from "hono";

import { idParamSchema, saveLessonNoteRequestSchema } from "@shared/schemas";
import type { LessonController } from "@/presentation/controllers/lesson-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createLessonRoutes = (lessonController: LessonController) =>
  new Hono()
    .use(requireAuth)
    .get("/:id", validate("param", idParamSchema), (context) => lessonController.get(context))
    .get("/:id/note", validate("param", idParamSchema), (context) =>
      lessonController.getNote(context),
    )
    .put(
      "/:id/note",
      validate("param", idParamSchema),
      validate("json", saveLessonNoteRequestSchema),
      (context) => lessonController.saveNote(context),
    );
