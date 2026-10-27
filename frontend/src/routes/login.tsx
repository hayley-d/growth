import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginPage } from "@/pages/login-page";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.session) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
