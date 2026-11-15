import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/atoms/sonner";
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
  component: RootComponent,
  errorComponent: RootErrorPage,
  notFoundComponent: RootNotFound,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

function RootNotFound() {
  return (
    <AppLayout>
      <NotFoundPage />
    </AppLayout>
  );
}
