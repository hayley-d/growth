import { createFileRoute } from "@tanstack/react-router";

import { LessonTestPage } from "@/pages/lesson-test-page";

export const Route = createFileRoute("/_app/_authenticated/lessons/$lessonId/test")({
  component: LessonTestPage,
});
