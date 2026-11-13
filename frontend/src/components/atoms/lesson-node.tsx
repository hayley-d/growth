import { Check, Lock, Play, Star } from "lucide-react";

import type { LearningPathLessonStatus, LessonKind } from "@shared/schemas";
import type { UnitTone } from "@/lib/learning-path/unit-tone";
import { cn } from "@/lib/utils";

type LessonNodeGlyphProperties = {
  status: LearningPathLessonStatus;
  kind: LessonKind;
  unit: UnitTone;
  className?: string;
};

type LessonNodeProperties = LessonNodeGlyphProperties & {
  title: string;
  onClick: () => void;
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

const nodeShape = (kind: LessonKind) => (kind === "checkpoint" ? "rounded-xl" : "rounded-full");

const nodeClasses = ({ status, kind, unit }: LessonNodeGlyphProperties) =>
  cn(
    "relative flex shrink-0 items-center justify-center border-2",
    nodeShape(kind),
    status === "completed" && cn("size-11", completedClasses[unit]),
    status === "current" && "size-14 border-foreground bg-accent text-accent-foreground",
    status === "locked" &&
      "size-11 border-dashed border-muted-foreground bg-muted text-muted-foreground",
  );

function LessonNodeContent({ status, kind }: Pick<LessonNodeGlyphProperties, "status" | "kind">) {
  const Icon =
    status === "completed"
      ? Check
      : status === "locked"
        ? Lock
        : kind === "checkpoint"
          ? Star
          : Play;

  return (
    <>
      {status === "current" ? (
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 bg-accent/60 motion-safe:animate-ping", nodeShape(kind))}
        />
      ) : null}
      <Icon
        aria-hidden="true"
        className="relative size-5"
        fill={status === "current" ? "currentColor" : "none"}
      />
    </>
  );
}

export function LessonNodeGlyph({ status, kind, unit, className }: LessonNodeGlyphProperties) {
  return (
    <span className={cn(nodeClasses({ status, kind, unit }), className)}>
      <LessonNodeContent status={status} kind={kind} />
    </span>
  );
}

export function LessonNode({
  title,
  status,
  kind,
  unit,
  onClick,
  className,
}: LessonNodeProperties) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title}, ${kind === "checkpoint" ? "quiz, " : ""}${statusWords[status]}`}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        nodeClasses({ status, kind, unit }),
        "transition-transform outline-none hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
        className,
      )}
    >
      <LessonNodeContent status={status} kind={kind} />
    </button>
  );
}
