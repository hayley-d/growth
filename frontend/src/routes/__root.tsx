import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/components/templates/app-layout";
import { sessionQueryOptions } from "@/lib/queries/auth.queries";
import { queryClient } from "@/lib/query-client";
import { SessionLoadError } from "@/lib/session-load-error";
import { NotFoundPage } from "@/pages/not-found-page";
import { RootErrorPage } from "@/pages/root-error-page";
import type { RouterContext } from "@/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const session = await queryClient.fetchQuery(sessionQueryOptions).catch((error) => {
      throw new SessionLoadError(error);
    });
    return { session };
  },
  component: RootLayout,
  errorComponent: RootErrorPage,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
