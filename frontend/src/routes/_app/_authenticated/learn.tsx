import { createFileRoute } from "@tanstack/react-router";

import { LearningPathPage } from "@/pages/learning-path-page";

export const Route = createFileRoute("/_app/_authenticated/learn")({
  component: LearningPathPage,
});
