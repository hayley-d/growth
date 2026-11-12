import { ChevronRight, Lock } from "lucide-react";

import type { PracticeTopicsResponse } from "@shared/schemas";
import { PracticeTopicGlyph } from "@/components/molecules/practice-topic-glyph";
import { practiceTopicDetails } from "@/lib/practice/topics";
import { cn } from "@/lib/utils";

type PracticeTopicsProperties = {
  topics: PracticeTopicsResponse["data"];
  isStarting: boolean;
  onSelect: (topic: PracticeTopicsResponse["data"][number]["topic"]) => void;
  className?: string;
};

export const practiceFigureClass =
  "rounded-3xl border-2 border-dashed bg-muted/40 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px]";

export function PracticeTopics({
  topics,
  isStarting,
  onSelect,
  className,
}: PracticeTopicsProperties) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {topics.map(({ topic, available }) => {
        const details = practiceTopicDetails[topic];
        return (
          <li key={topic}>
            <button
              type="button"
              disabled={!available || isStarting}
              onClick={() => onSelect(topic)}
              className={cn(
                "group flex h-full w-full flex-col gap-4 rounded-3xl border-2 bg-card p-4 text-left outline-none transition-[translate,border-color] focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
                available
                  ? "enabled:hover:-translate-y-1 enabled:hover:border-foreground/70 disabled:cursor-wait"
                  : "cursor-not-allowed border-dashed opacity-70",
              )}
            >
              <span className={cn(practiceFigureClass, "grid h-32 place-items-center")}>
                <PracticeTopicGlyph topic={topic} className="h-24 w-auto" />
              </span>
              <span className="flex items-start justify-between gap-3 px-1">
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-semibold">{details.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {available ? details.description : "Unlock a lesson on this first."}
                  </span>
                </span>
                {available ? (
                  <ChevronRight
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 transition-transform group-enabled:group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                ) : (
                  <Lock aria-hidden="true" className="mt-1 size-5 shrink-0" />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
