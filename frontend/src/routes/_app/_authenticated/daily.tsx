import { createFileRoute } from "@tanstack/react-router";

import { DailyChallengePage } from "@/pages/daily-challenge-page";

export const Route = createFileRoute("/_app/_authenticated/daily")({
  component: DailyChallengePage,
});
