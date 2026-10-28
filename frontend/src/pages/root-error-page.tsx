import type { ErrorComponentProps } from "@tanstack/react-router";

import { AppLayout } from "@/components/templates/app-layout";
import { SessionLoadError } from "@/lib/session-load-error";
import { ErrorPage } from "@/pages/error-page";
import { SessionErrorPage } from "@/pages/session-error-page";

export function RootErrorPage({ error }: ErrorComponentProps) {
  if (error instanceof SessionLoadError) return <SessionErrorPage />;

  return (
    <AppLayout>
      <ErrorPage />
    </AppLayout>
  );
}
