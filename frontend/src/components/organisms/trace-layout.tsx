import { type ReactNode, useId, useState } from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type TraceTab = "tree" | "code";

type TraceLayoutProperties = {
  tree: ReactNode;
  code: ReactNode;
  message: ReactNode;
  controls?: ReactNode;
  codeHidden?: boolean;
  pinControls?: boolean;
  className?: string;
};

const tabs: { id: TraceTab; label: string }[] = [
  { id: "tree", label: "Tree" },
  { id: "code", label: "Code" },
];

const nextTabFor = (key: string, current: TraceTab): TraceTab | null => {
  if (key === "Home") return "tree";
  if (key === "End") return "code";
  if (key === "ArrowLeft" || key === "ArrowRight") return current === "tree" ? "code" : "tree";
  return null;
};

export function TraceLayout({
  tree,
  code,
  message,
  controls,
  codeHidden = false,
  pinControls = true,
  className,
}: TraceLayoutProperties) {
  const isWide = useMediaQuery("(min-width: 48rem)");
  const [tab, setTab] = useState<TraceTab>("tree");
  const baseId = useId();
  const showTabs = !isWide && !codeHidden;
  const shownTab: TraceTab = codeHidden ? "tree" : tab;

  return (
    <div className={cn("overflow-clip rounded-2xl border bg-card", className)}>
      {isWide ? null : (
        <div role="tablist" aria-label="Show" hidden={codeHidden} className="flex gap-1 p-3 pb-0">
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
                  const nextTab = nextTabFor(event.key, tab);
                  if (!nextTab) return;
                  event.preventDefault();
                  setTab(nextTab);
                  document.getElementById(`${baseId}-${nextTab}-tab`)?.focus();
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
      )}
      <div
        className={cn(
          isWide && !codeHidden && "grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] divide-x",
        )}
      >
        {tabs.map((option) => (
          <section
            key={option.id}
            {...(showTabs
              ? {
                  role: "tabpanel",
                  id: `${baseId}-${option.id}-panel`,
                  "aria-labelledby": `${baseId}-${option.id}-tab`,
                  hidden: option.id !== shownTab,
                }
              : { "aria-label": option.label, hidden: codeHidden && option.id === "code" })}
            className={cn(
              "min-w-0",
              isWide ? "p-6" : "p-4",
              (isWide || codeHidden) && option.id === "tree" && "flex items-center justify-center",
            )}
          >
            {option.id === "tree" ? tree : code}
          </section>
        ))}
      </div>
      <div
        className={cn(
          "z-10 bg-card",
          pinControls && "md:sticky md:bottom-[var(--dock-bottom,0px)]",
        )}
      >
        <div className="border-t bg-muted/40 px-4 py-4 sm:px-6">{message}</div>
        {controls ? <div className="border-t px-4 py-3 sm:px-6">{controls}</div> : null}
      </div>
    </div>
  );
}
