import type { ReactNode } from "react";

type PracticeLayoutProperties = {
  topicLabel: string | null;
  action?: ReactNode;
  children: ReactNode;
};

export function PracticeLayout({ topicLabel, action, children }: PracticeLayoutProperties) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {topicLabel ? <p className="text-sm text-muted-foreground">{topicLabel}</p> : null}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Practice</h1>
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
