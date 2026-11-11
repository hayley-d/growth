import { createFileRoute } from "@tanstack/react-router";

import { lessonSearchSchema } from "@/lib/lesson/lesson-search";
import { LessonPage } from "@/pages/lesson-page";

export const Route = createFileRoute("/_app/_authenticated/lessons/$lessonId/")({
  validateSearch: lessonSearchSchema,
  component: LessonPage,
});
