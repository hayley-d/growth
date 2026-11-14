import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type TestLayoutProperties = {
  lessonTitle: string | null;
  children: ReactNode;
};

export function TestLayout({ lessonTitle, children }: TestLayoutProperties) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 lg:max-w-5xl">
      <header className="flex items-start gap-3">
        <Link
          to="/learn"
          aria-label="Leave the test"
          className="grid size-11 shrink-0 place-items-center rounded-md border border-transparent hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X aria-hidden className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          {lessonTitle ? <p className="text-sm text-muted-foreground">{lessonTitle}</p> : null}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Test</h1>
        </div>
      </header>
      {children}
    </div>
  );
}
