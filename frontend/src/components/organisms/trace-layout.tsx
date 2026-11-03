import { type ReactNode, useId, useState } from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type TraceTab = "tree" | "code";

type TraceLayoutProperties = {
  tree: ReactNode;
  code: ReactNode;
  message: ReactNode;
  controls?: ReactNode;
  className?: string;
};

const tabs: { id: TraceTab; label: string }[] = [
  { id: "tree", label: "Tree" },
  { id: "code", label: "Code" },
];

export function TraceLayout({ tree, code, message, controls, className }: TraceLayoutProperties) {
  const isWide = useMediaQuery("(min-width: 48rem)");
  const [tab, setTab] = useState<TraceTab>("tree");
  const baseId = useId();

  const footer = (
    <>
      <div className="border-t bg-muted/40 px-4 py-4 sm:px-6">{message}</div>
      {controls ? <div className="border-t px-4 py-3 sm:px-6">{controls}</div> : null}
    </>
  );

  if (isWide) {
    return (
      <div className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] divide-x">
          <section aria-label="Tree" className="flex min-w-0 items-center justify-center p-6">
            {tree}
          </section>
          <section aria-label="Code" className="min-w-0 p-6">
            {code}
          </section>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
      <div role="tablist" aria-label="Show" className="flex gap-1 p-3 pb-0">
        {tabs.map((option) => {
          const isSelected = option.id === tab;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              id={`${baseId}-${option.id}-tab`}
              aria-controls={`${baseId}-${option.id}-panel`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setTab(option.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                setTab(tab === "tree" ? "code" : "tree");
              }}
              className={cn(
                "min-h-11 flex-1 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none",
                isSelected
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {tabs.map((option) => (
        <div
          key={option.id}
          role="tabpanel"
          id={`${baseId}-${option.id}-panel`}
          aria-labelledby={`${baseId}-${option.id}-tab`}
          hidden={option.id !== tab}
          className="min-w-0 p-4"
        >
          {option.id === "tree" ? tree : code}
        </div>
      ))}
      {footer}
    </div>
  );
}
