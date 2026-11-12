import type { PracticeTopicsResponse } from "@shared/schemas";
import { practiceTopicDetails } from "@/lib/practice/topics";
import { cn } from "@/lib/utils";

type PracticeTopicsProperties = {
  topics: PracticeTopicsResponse["data"];
  isStarting: boolean;
  onSelect: (topic: PracticeTopicsResponse["data"][number]["topic"]) => void;
  className?: string;
};

export function PracticeTopics({
  topics,
  isStarting,
  onSelect,
  className,
}: PracticeTopicsProperties) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {topics.map(({ topic, available }) => {
        const details = practiceTopicDetails[topic];
        return (
          <li key={topic}>
            <button
              type="button"
              disabled={!available || isStarting}
              onClick={() => onSelect(topic)}
              className="flex min-h-11 w-full flex-col items-start gap-1 rounded-xl border p-4 text-left hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border"
            >
              <span className="text-lg font-semibold">{details.label}</span>
              <span className="text-sm text-muted-foreground">{details.description}</span>
              {available ? null : <span className="text-sm font-medium">No questions yet</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
