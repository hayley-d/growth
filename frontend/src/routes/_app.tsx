import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppLayout } from "@/components/templates/app-layout";
import { meQueryOptions } from "@/lib/queries/user.queries";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    if (!context.session) return;
    const me = await queryClient.fetchQuery(meQueryOptions);
    if (!me.data.profile.onboardingComplete) throw redirect({ to: "/onboarding" });
  },
  component: AppShell,
});

function AppShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
