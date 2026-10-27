import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUpPage } from "@/pages/sign-up-page";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: ({ context }) => {
    if (context.session) throw redirect({ to: "/" });
  },
  component: SignUpPage,
});
