import type { ReactNode } from "react";

import { Logo } from "@/components/atoms/logo";
import { AvlBackground } from "@/components/organisms/avl-background";

type AuthLayoutProperties = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProperties) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center px-4 py-10 sm:justify-center">
      <AvlBackground />
      <main className="relative flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 font-semibold">
          <Logo />
          <span className="text-lg">Growth</span>
        </div>
        <div className="rounded-xl border bg-background/85 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
