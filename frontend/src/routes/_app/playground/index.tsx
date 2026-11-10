import { createFileRoute } from "@tanstack/react-router";

import { playgroundSearchSchema } from "@/lib/playground/setup";
import { PlaygroundSetupPage } from "@/pages/playground-setup-page";

export const Route = createFileRoute("/_app/playground/")({
  validateSearch: playgroundSearchSchema,
  component: PlaygroundSetupPage,
});
