import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SettingsCardProperties = {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SettingsCard({
  id,
  title,
  description,
  children,
  className,
}: SettingsCardProperties) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "flex max-w-2xl flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-6",
        className,
      )}
    >
      <div>
        <h2 id={id} className="text-lg font-semibold">
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

type SettingsRowProperties = {
  icon: LucideIcon;
  title: string;
  description: string;
  controlId: string;
  control: ReactNode;
  children?: ReactNode;
};

export function SettingsRow({
  icon: Icon,
  title,
  description,
  controlId,
  control,
  children,
}: SettingsRowProperties) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <label htmlFor={controlId} className="font-medium">
            {title}
          </label>
          <p id={`${controlId}-description`} className="text-sm text-muted-foreground">
            {description}
          </p>
          {children}
        </div>
      </div>
      <div className="pl-12 sm:shrink-0 sm:pl-0">{control}</div>
    </li>
  );
}
