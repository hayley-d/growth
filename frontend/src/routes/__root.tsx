import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/components/templates/app-layout";
import { sessionQueryOptions } from "@/lib/queries/auth.queries";
import { queryClient } from "@/lib/query-client";
import { NotFoundPage } from "@/pages/not-found-page";
import type { RouterContext } from "@/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const session = await queryClient.ensureQueryData(sessionQueryOptions);
    return { session };
  },
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
