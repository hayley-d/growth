import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import type { PracticeSummary as PracticeSummaryData } from "@shared/schemas";
import { MasteryShift } from "@/components/molecules/mastery-shift";
import { practiceFigureClass } from "@/components/organisms/practice-topics";
import { SessionTree, SessionTreeKey } from "@/components/organisms/session-tree";
import { type PracticeAnswer, ratingToMastery } from "@/lib/practice/session";
import { cn } from "@/lib/utils";

type PracticeSummaryProperties = {
  summary: PracticeSummaryData;
  answers: readonly PracticeAnswer[];
  onPracticeAgain: () => void;
  className?: string;
};

const pillClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-transform hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none";

export function PracticeSummary({
  summary,
  answers,
  onPracticeAgain,
  className,
}: PracticeSummaryProperties) {
  const slipped = summary.lessons.filter((lesson) => lesson.ratingAfter < lesson.ratingBefore);

  return (
    <section
      aria-labelledby="summary-heading"
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center",
        className,
      )}
    >
      {summary.answered === 0 ? (
        <div className="flex flex-col gap-2">
          <h1 id="summary-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            No tree this time
          </h1>
          <p className="text-lg text-muted-foreground">
            You stopped before answering. Pick a topic whenever you're ready.
          </p>
        </div>
      ) : (
        <>
          <div className={cn(practiceFigureClass, "w-full px-6 py-8")}>
            <SessionTree
              answers={answers}
              pending={false}
              size="lg"
              className="mx-auto max-h-72 max-w-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 id="summary-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              You grew a {summary.answered}-node tree
            </h1>
            <p className="text-lg text-muted-foreground">
              {summary.correct} of {summary.answered} right. The squares are the ones worth another
              look.
            </p>
          </div>
          <SessionTreeKey className="justify-center" />
        </>
      )}
      {summary.lessons.length > 0 ? (
        <section
          aria-labelledby="standing-heading"
          className="flex w-full flex-col gap-4 rounded-3xl border-2 bg-card p-5 text-left sm:p-7"
        >
          <div className="flex flex-col gap-1">
            <h2 id="standing-heading" className="text-lg font-semibold">
              Where you'd stand
            </h2>
            <p className="text-sm text-muted-foreground">
              Practice doesn't change your mastery. This is how today's answers would have moved it.
            </p>
          </div>
          {summary.lessons.map((lesson) => (
            <MasteryShift
              key={lesson.lessonId}
              title={lesson.title}
              before={ratingToMastery(lesson.ratingBefore)}
              after={ratingToMastery(lesson.ratingAfter)}
            />
          ))}
          {slipped.length > 0 ? (
            <div className="flex flex-col gap-2 border-t pt-4">
              <h3 className="text-sm font-medium">Go over again</h3>
              <ul className="flex flex-wrap gap-2">
                {slipped.map((lesson) => (
                  <li key={lesson.lessonId}>
                    <Link
                      to="/lessons/$lessonId"
                      params={{ lessonId: lesson.lessonId }}
                      className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 px-4 text-sm font-medium hover:border-foreground/70 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {lesson.title}
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className={cn(pillClass, "bg-primary text-primary-foreground")}
          onClick={onPracticeAgain}
        >
          Practice again
        </button>
        <Link to="/learn" className={cn(pillClass, "border-2")}>
          Back to Learn
        </Link>
      </div>
    </section>
  );
}
