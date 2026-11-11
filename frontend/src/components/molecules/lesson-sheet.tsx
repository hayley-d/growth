import { Check, Lock, Play, Star } from "lucide-react";
import { useRef } from "react";

import type { LearningPathLesson } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/atoms/sheet";
import { MasteryMeter } from "@/components/molecules/mastery-meter";
import { cn } from "@/lib/utils";

type LessonSheetProperties = {
  lesson: LearningPathLesson | null;
  unitLabel: string;
  onClose: () => void;
  onStart: (lessonId: string) => void;
  onReview: (lessonId: string) => void;
  onTakeTest: (lessonId: string) => void;
  isStarting?: boolean;
  errorMessage?: string | null;
};

const badgeWords = {
  completed: "Completed",
  current: "Up next",
  locked: "Locked",
};

const badgeClasses = {
  completed: "border-foreground/40",
  current: "border-foreground bg-accent text-accent-foreground",
  locked: "border-dashed border-muted-foreground text-muted-foreground",
};

export function LessonSheet({
  lesson: currentLesson,
  unitLabel: currentUnitLabel,
  onClose,
  onStart,
  onReview,
  onTakeTest,
  isStarting = false,
  errorMessage,
}: LessonSheetProperties) {
  const lastShown = useRef({ lesson: currentLesson, unitLabel: currentUnitLabel });
  if (currentLesson) lastShown.current = { lesson: currentLesson, unitLabel: currentUnitLabel };
  const { lesson, unitLabel } = lastShown.current;
  const isQuiz = lesson?.kind === "checkpoint";
  const BadgeIcon =
    lesson?.status === "completed"
      ? Check
      : lesson?.status === "locked"
        ? Lock
        : isQuiz
          ? Star
          : Play;

  return (
    <Sheet open={currentLesson !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="mx-auto w-full max-w-xl rounded-t-2xl">
        {lesson ? (
          <>
            <SheetHeader className="pr-14">
              <p className="text-xs tracking-wide text-muted-foreground">{unitLabel}</p>
              <SheetTitle className="text-lg">{lesson.title}</SheetTitle>
              <SheetDescription>{lesson.summary}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 px-4 pb-6">
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  badgeClasses[lesson.status],
                )}
              >
                <BadgeIcon aria-hidden="true" className="size-3.5" />
                {badgeWords[lesson.status]}
                {isQuiz ? " · quiz" : ""}
              </span>
              {lesson.status === "locked" ? null : <MasteryMeter mastery={lesson.mastery} />}
              {lesson.status === "completed" ? (
                <Button size="lg" className="min-h-11" onClick={() => onReview(lesson.id)}>
                  Review lesson
                </Button>
              ) : null}
              {lesson.status === "current" ? (
                <Button
                  size="lg"
                  className="min-h-11"
                  disabled={isStarting}
                  onClick={() => onStart(lesson.id)}
                >
                  {isStarting ? "Starting..." : isQuiz ? "Start quiz" : "Start lesson"}
                </Button>
              ) : null}
              {lesson.status === "locked" ? (
                <>
                  <Button size="lg" className="min-h-11" onClick={() => onTakeTest(lesson.id)}>
                    Take the test to skip ahead
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isQuiz
                      ? "Pass it and every lesson before it counts as done."
                      : "Passing the test completes every earlier lesson."}
                  </p>
                </>
              ) : null}
              {errorMessage ? (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
