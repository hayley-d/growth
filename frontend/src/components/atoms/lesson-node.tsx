import { Check, Lock, Play, Star } from "lucide-react";

import type { LearningPathLessonStatus, LessonKind } from "@shared/schemas";
import type { UnitTone } from "@/lib/learning-path/unit-tone";
import { cn } from "@/lib/utils";

type LessonNodeProperties = {
  title: string;
  status: LearningPathLessonStatus;
  kind: LessonKind;
  unit: UnitTone;
  onClick: () => void;
  className?: string;
};

const statusWords: Record<LearningPathLessonStatus, string> = {
  completed: "completed",
  current: "up next",
  locked: "locked",
};

const completedClasses: Record<UnitTone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  secondary: "border-secondary bg-secondary text-secondary-foreground",
  accent: "border-foreground/60 bg-accent text-accent-foreground",
};

export function LessonNode({
  title,
  status,
  kind,
  unit,
  onClick,
  className,
}: LessonNodeProperties) {
  const shape = kind === "checkpoint" ? "rounded-xl" : "rounded-full";
  const Icon =
    status === "completed"
      ? Check
      : status === "locked"
        ? Lock
        : kind === "checkpoint"
          ? Star
          : Play;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title}, ${kind === "checkpoint" ? "quiz, " : ""}${statusWords[status]}`}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "relative flex shrink-0 items-center justify-center border-2 transition-transform outline-none hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
        shape,
        status === "completed" && cn("size-11", completedClasses[unit]),
        status === "current" && "size-14 border-foreground bg-accent text-accent-foreground",
        status === "locked" &&
          "size-11 border-dashed border-muted-foreground bg-muted text-muted-foreground",
        className,
      )}
    >
      {status === "current" ? (
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 bg-accent/60 motion-safe:animate-ping", shape)}
        />
      ) : null}
      <Icon
        aria-hidden="true"
        className="relative size-5"
        fill={status === "current" ? "currentColor" : "none"}
      />
    </button>
  );
}
