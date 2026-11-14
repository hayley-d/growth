import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";

import { type AttemptResult, masteryLabel } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type TestResultsProperties = {
  result: AttemptResult;
  isRetaking: boolean;
  onRetake: () => void;
  className?: string;
};

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-medium focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

export function TestResults({ result, isRetaking, onRetake, className }: TestResultsProperties) {
  const Icon = result.passed ? Check : X;
  return (
    <section
      aria-labelledby="results-heading"
      className={cn("flex flex-col gap-6 rounded-xl border p-4 sm:p-6", className)}
    >
      <h2 id="results-heading" className="flex items-center gap-3 text-2xl font-semibold">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-full border-2",
            result.passed ? "border-primary text-primary" : "border-destructive text-destructive",
          )}
        >
          <Icon aria-hidden className="size-6" />
        </span>
        {result.passed ? "Passed" : "Not passed"}
      </h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted-foreground">Score</dt>
          <dd className="text-xl font-semibold">{result.score}%</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Points</dt>
          <dd className="text-xl font-semibold">{result.points}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Mastery</dt>
          <dd className="flex flex-wrap items-center gap-1 text-xl font-semibold">
            <span>{result.masteryBefore}%</span>
            <ArrowRight aria-label="to" className="size-4" />
            <span>{result.masteryAfter}%</span>
            <span className="w-full text-sm font-normal text-muted-foreground">
              {masteryLabel(result.masteryAfter)}
            </span>
          </dd>
        </div>
      </dl>
      {result.reviewLessons.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Topics to go over again</h3>
          <ul className="flex flex-col gap-2">
            {result.reviewLessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to="/lessons/$lessonId"
                  params={{ lessonId: lesson.id }}
                  className={`${linkClass} w-full justify-start border hover:bg-secondary hover:text-secondary-foreground sm:w-auto`}
                >
                  Review {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/learn"
          className={cn(
            linkClass,
            result.passed
              ? "bg-primary text-primary-foreground hover:bg-primary/90 sm:order-last"
              : "border hover:bg-secondary hover:text-secondary-foreground",
          )}
        >
          Back to Learn
        </Link>
        <Button
          type="button"
          variant={result.passed ? "outline" : "default"}
          className="min-h-11 px-5"
          disabled={isRetaking}
          onClick={onRetake}
        >
          {isRetaking ? "Starting..." : "Retake"}
        </Button>
      </div>
    </section>
  );
}
