import { ChevronRight, CircleX, Hand, RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";

import type { LogEntry } from "@/lib/playground/playground-reducer";
import { cn } from "@/lib/utils";

type CommandLogProperties = {
  entries: readonly LogEntry[];
  busy: boolean;
  emptyText: string;
  onReplay: (id: number) => void;
  className?: string;
};

export function CommandLog({
  entries,
  busy,
  emptyText,
  onReplay,
  className,
}: CommandLogProperties) {
  const listReference = useRef<HTMLOListElement>(null);
  const lastId = entries.at(-1)?.id;

  useEffect(() => {
    const list = listReference.current;
    if (list && lastId !== undefined) list.scrollTop = list.scrollHeight;
  }, [lastId]);

  if (entries.length === 0) {
    return <p className={cn("px-1 text-sm text-muted-foreground", className)}>{emptyText}</p>;
  }

  return (
    <ol
      ref={listReference}
      aria-label="What you've done"
      className={cn("flex max-h-60 flex-col gap-1 overflow-y-auto font-mono text-sm", className)}
    >
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 rounded-lg px-2 py-1.5",
            entry.tone === "bad" && "bg-destructive/10",
          )}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="inline-flex items-center gap-1 font-semibold">
              {entry.tone === "bad" ? (
                <CircleX aria-label="Didn't run" className="size-3.5 shrink-0 text-destructive" />
              ) : (
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              )}
              {entry.command}
            </span>
            {entry.via === "dragged" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 font-sans text-xs text-muted-foreground">
                <Hand aria-hidden="true" className="size-3" />
                dragged
              </span>
            ) : null}
            <span className="w-full font-sans text-muted-foreground [overflow-wrap:anywhere]">
              {entry.message}
            </span>
          </span>
          {entry.replayable ? (
            <button
              type="button"
              onClick={() => onReplay(entry.id)}
              disabled={busy}
              aria-label={`Run ${entry.command} again`}
              className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
