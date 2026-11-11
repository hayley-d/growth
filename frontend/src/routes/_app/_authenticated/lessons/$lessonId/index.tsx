import { createFileRoute } from "@tanstack/react-router";

import { LessonPlaceholderPage } from "@/pages/lesson-placeholder-page";

export const Route = createFileRoute("/_app/_authenticated/lessons/$lessonId/")({
  component: LessonPlaceholderPage,
});
