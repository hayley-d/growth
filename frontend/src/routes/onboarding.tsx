import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { SetupLayout } from "@/components/templates/setup-layout";
import { meQueryOptions } from "@/lib/queries/user.queries";
import { queryClient } from "@/lib/query-client";
import { OnboardingPage } from "@/pages/onboarding-page";

export const Route = createFileRoute("/onboarding")({
  validateSearch: z.object({ retake: z.literal(true).optional().catch(undefined) }),
  beforeLoad: async ({ context, search }) => {
    if (!context.session) throw redirect({ to: "/login" });
    const me = await queryClient.fetchQuery(meQueryOptions);
    const onboarded = me.data.profile.onboardingComplete;
    if (onboarded && !search.retake) throw redirect({ to: "/" });
    if (!onboarded && search.retake) throw redirect({ to: "/onboarding" });
  },
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const { retake } = Route.useSearch();
  return (
    <SetupLayout>
      <OnboardingPage retake={retake === true} />
    </SetupLayout>
  );
}
