import { createFileRoute } from "@tanstack/react-router";

import { PracticePage } from "@/pages/practice-page";

export const Route = createFileRoute("/_app/_authenticated/practice")({
  component: PracticePage,
});
