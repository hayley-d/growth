import { createFileRoute } from "@tanstack/react-router";

import { playgroundSearchSchema } from "@/lib/playground/setup";
import { PlaygroundPage } from "@/pages/playground-page";

export const Route = createFileRoute("/_app/playground/play")({
  validateSearch: playgroundSearchSchema,
  component: PlaygroundPage,
});
