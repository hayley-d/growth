import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PracticeLayoutProperties = {
  /** The session panel. On wide screens it sits beside the question; on phones, above it. */
  aside?: ReactNode;
  children: ReactNode;
};

export function PracticeLayout({ aside, children }: PracticeLayoutProperties) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full gap-6",
        aside ? "max-w-6xl lg:grid-cols-[minmax(0,1fr)_20rem]" : "max-w-5xl",
      )}
    >
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
      {aside ? <aside className="order-first lg:order-none">{aside}</aside> : null}
    </div>
  );
}
