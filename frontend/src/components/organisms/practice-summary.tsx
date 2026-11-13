import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { PracticeSummary as PracticeSummaryData } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type PracticeSummaryProperties = {
  summary: PracticeSummaryData;
  onPracticeAgain: () => void;
  className?: string;
};

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-medium focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

const formatChange = (change: number) => (change > 0 ? `+${change}` : `${change}`);

export function PracticeSummary({
  summary,
  onPracticeAgain,
  className,
}: PracticeSummaryProperties) {
  return (
    <section
      aria-labelledby="summary-heading"
      className={cn("flex flex-col gap-6 rounded-xl border p-4 sm:p-6", className)}
    >
      <h2 id="summary-heading" className="text-2xl font-semibold">
        Practice summary
      </h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted-foreground">Answered</dt>
          <dd className="text-xl font-semibold">{summary.answered}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Correct</dt>
          <dd className="text-xl font-semibold">
            {summary.correct} of {summary.answered}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Rating change</dt>
          <dd className="text-xl font-semibold">{formatChange(summary.ratingChange)}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        Practice doesn't change your mastery, so a lower rating here costs you nothing.
      </p>
      {summary.lessons.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Rating by lesson</h3>
          <ul className="flex flex-col gap-2">
            {summary.lessons.map((lesson) => (
              <li
                key={lesson.lessonId}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border p-3"
              >
                <span className="font-medium">{lesson.title}</span>
                <span className="flex items-center gap-1 text-sm">
                  {lesson.ratingBefore}
                  <ArrowRight aria-label="to" className="size-4" />
                  {lesson.ratingAfter}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatChange(lesson.ratingAfter - lesson.ratingBefore)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="min-h-11 px-5" onClick={onPracticeAgain}>
          Practice again
        </Button>
        <Link
          to="/learn"
          className={cn(linkClass, "bg-primary text-primary-foreground hover:bg-primary/90")}
        >
          Back to Learn
        </Link>
      </div>
    </section>
  );
}
