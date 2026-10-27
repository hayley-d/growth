import { createFileRoute } from "@tanstack/react-router";

import { CoursesPage } from "@/pages/courses-page";

export const Route = createFileRoute("/_authenticated/courses")({
  component: CoursesPage,
});
