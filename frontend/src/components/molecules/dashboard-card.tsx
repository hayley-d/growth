import { type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

type DashboardCardProperties = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ title, children, className }: DashboardCardProperties) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn("flex flex-col gap-4 rounded-lg border p-4 sm:p-6", className)}
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}
