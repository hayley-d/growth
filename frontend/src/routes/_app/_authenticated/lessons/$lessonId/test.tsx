import { createFileRoute } from "@tanstack/react-router";

import { LessonTestPlaceholderPage } from "@/pages/lesson-test-placeholder-page";

export const Route = createFileRoute("/_app/_authenticated/lessons/$lessonId/test")({
  component: LessonTestPlaceholderPage,
});
