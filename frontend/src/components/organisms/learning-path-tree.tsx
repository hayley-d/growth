import { type CSSProperties, useRef, useState } from "react";

import type { LearningPathLesson, LearningPathUnit } from "@shared/schemas";
import { LessonNode } from "@/components/atoms/lesson-node";
import { LessonSheet } from "@/components/molecules/lesson-sheet";
import {
  buildLessonTree,
  lessonPositions,
  type MapLayout,
  type MapPosition,
  walkToLesson,
} from "@/lib/learning-path/lesson-tree";
import { unitTone } from "@/lib/learning-path/unit-tone";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type LearningPathTreeProperties = {
  units: LearningPathUnit[];
  onStartLesson: (lessonId: string) => void;
  onReviewLesson: (lessonId: string) => void;
  onTakeTest: (lessonId: string) => void;
  isStarting?: boolean;
  errorMessage?: string | null;
  onSheetChange?: () => void;
  className?: string;
};

type Entry = {
  lesson: LearningPathLesson;
  unit: LearningPathUnit;
};

const nodePoint = (layout: MapLayout, position: MapPosition): MapPosition =>
  layout === "top-down"
    ? { x: position.x, y: position.y * 0.58 }
    : { x: position.x * 0.55, y: position.y };

const labelPoint = (layout: MapLayout, index: number, position: MapPosition): MapPosition =>
  layout === "top-down"
    ? { x: position.x, y: index % 2 === 0 ? 68 : 83 }
    : { x: 60, y: position.y };

const toPoints = (points: MapPosition[]) => points.map(({ x, y }) => `${x},${y}`).join(" ");

export function LearningPathTree({
  units,
  onStartLesson,
  onReviewLesson,
  onTakeTest,
  isStarting,
  errorMessage,
  onSheetChange,
  className,
}: LearningPathTreeProperties) {
  const layout: MapLayout = useMediaQuery("(min-width: 768px)") ? "top-down" : "sideways";
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const containerReference = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries: Entry[] = [...units]
    .sort((first, second) => first.position - second.position)
    .flatMap((unit) =>
      [...unit.lessons]
        .sort((first, second) => first.position - second.position)
        .map((lesson) => ({ lesson, unit })),
    );
  const tree = buildLessonTree(entries.length);
  const positions = lessonPositions(tree, layout);
  const points = positions.map((position) => nodePoint(layout, position));
  const currentIndex = entries.findIndex((entry) => entry.lesson.status === "current");
  const walk = walkToLesson(entries.length, currentIndex === -1 ? entries.length - 1 : currentIndex)
    .map((index) => points[index])
    .filter((point): point is MapPosition => point !== undefined);
  const selected = entries.find((entry) => entry.lesson.id === selectedId) ?? null;

  const select = (lessonId: string, index: number) => {
    containerReference.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
    onSheetChange?.();
    setSelectedId(lessonId);
  };

  return (
    <>
      <div
        ref={containerReference}
        className={cn(
          "relative mx-auto w-full max-w-5xl",
          layout === "top-down" ? "h-[34rem]" : "h-[48rem]",
          className,
        )}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          {tree.map((node) => {
            const from = points[node.index];
            const to = node.parent === null ? undefined : points[node.parent];
            return from && to ? (
              <line
                key={`edge-${node.index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="stroke-muted-foreground/50"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            ) : null;
          })}
          {entries.map(({ lesson }, index) => {
            const from = points[index];
            const to = labelPoint(layout, index, positions[index] ?? { x: 0, y: 0 });
            return from ? (
              <line
                key={`leader-${lesson.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x - (layout === "sideways" ? 1.5 : 0)}
                y2={to.y}
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeDasharray="1 5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : null;
          })}
          {walk.length > 1 ? (
            <>
              <polyline
                points={toPoints(walk)}
                fill="none"
                className="stroke-accent"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points={toPoints(walk)}
                fill="none"
                className="stroke-primary-foreground"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}
        </svg>
        {entries.map(({ lesson, unit }, index) => {
          const point = points[index];
          const label = labelPoint(layout, index, positions[index] ?? { x: 0, y: 0 });
          if (!point) return null;
          return (
            <div key={lesson.id}>
              <div
                data-index={index}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div
                  className="lesson-float"
                  style={
                    {
                      "--lesson-float-duration": `${5 + (index % 4) * 0.7}s`,
                      "--lesson-float-delay": `-${(index * 0.8) % 5}s`,
                    } as CSSProperties
                  }
                >
                  <LessonNode
                    title={lesson.title}
                    status={lesson.status}
                    kind={lesson.kind}
                    unit={unitTone(unit.position)}
                    onClick={() => select(lesson.id, index)}
                  />
                </div>
              </div>
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute text-xs leading-tight",
                  layout === "top-down"
                    ? "w-28 -translate-x-1/2 text-center"
                    : "right-1 -translate-y-1/2 text-left",
                  lesson.status === "locked" && "text-muted-foreground",
                )}
                style={{ left: `${label.x}%`, top: `${label.y}%` }}
              >
                {lesson.status === "current" ? <p className="font-semibold">You are here</p> : null}
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {lesson.kind === "checkpoint" ? "Quiz" : "Lesson"} {index + 1}
                </p>
                <p className={lesson.status === "locked" ? "" : "font-semibold"}>{lesson.title}</p>
              </div>
            </div>
          );
        })}
      </div>
      <LessonSheet
        lesson={selected?.lesson ?? null}
        unitLabel={selected ? `Unit ${selected.unit.position} · ${selected.unit.title}` : ""}
        onClose={() => {
          onSheetChange?.();
          setSelectedId(null);
        }}
        onStart={onStartLesson}
        onReview={onReviewLesson}
        onTakeTest={onTakeTest}
        isStarting={isStarting}
        errorMessage={errorMessage}
      />
    </>
  );
}
