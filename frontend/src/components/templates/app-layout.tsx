import type { ReactNode } from "react";

import { Navbar } from "@/components/organisms/navbar";

type AppLayoutProperties = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProperties) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
