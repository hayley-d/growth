import type { ReactNode } from "react";

import { Logo } from "@/components/atoms/logo";
import { UserMenu } from "@/components/molecules/user-menu";

type SetupLayoutProperties = {
  children: ReactNode;
};

export function SetupLayout({ children }: SetupLayoutProperties) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-2 px-4 sm:px-6">
          <Logo />
          <span className="text-lg font-semibold">Growth</span>
          <div className="ml-auto">
            <UserMenu showSettings={false} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
