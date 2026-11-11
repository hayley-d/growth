import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

type LessonUnavailableProperties = {
  lessonId: string;
  reason: "locked" | "missing" | "error";
  message?: string;
  onRetry?: () => void;
};

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 font-medium focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function LessonUnavailable({
  lessonId,
  reason,
  message,
  onRetry,
}: LessonUnavailableProperties) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      {reason === "locked" ? (
        <span className="grid size-14 place-items-center rounded-full bg-muted">
          <Lock aria-hidden className="size-6" />
        </span>
      ) : null}
      <h1 className="text-2xl font-semibold sm:text-3xl">
        {reason === "locked"
          ? "This lesson is locked"
          : reason === "missing"
            ? "We couldn't find that lesson"
            : "The lesson didn't load"}
      </h1>
      <p role={reason === "error" ? "alert" : undefined} className="text-muted-foreground">
        {reason === "locked"
          ? "Finish the lessons before it first, or show what you know and skip ahead."
          : reason === "missing"
            ? "It may have been moved or taken out of the course."
            : message}
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {reason === "locked" ? (
          <Link
            to="/lessons/$lessonId/test"
            params={{ lessonId }}
            className={`${linkClass} bg-primary text-primary-foreground hover:bg-primary/90`}
          >
            Take the test to skip ahead
          </Link>
        ) : null}
        {reason === "error" && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`${linkClass} bg-primary text-primary-foreground hover:bg-primary/90`}
          >
            Try again
          </button>
        ) : null}
        <Link
          to="/learn"
          className={`${linkClass} border hover:bg-secondary hover:text-secondary-foreground`}
        >
          Back to the map
        </Link>
      </div>
    </div>
  );
}
