import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/components/templates/app-layout";
import { NotFoundPage } from "@/pages/not-found-page";

export const Route = createRootRoute({
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
