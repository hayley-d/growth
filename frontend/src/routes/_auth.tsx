import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthLayout } from "@/components/templates/auth-layout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.session) throw redirect({ to: "/" });
  },
  component: AuthShell,
});

function AuthShell() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
