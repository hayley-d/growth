import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

type LessonEndProperties = {
  lessonId: string;
  lessonTitle: string;
};

export function LessonEnd({ lessonId, lessonTitle }: LessonEndProperties) {
  return (
    <section
      aria-labelledby="lesson-end-heading"
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check aria-hidden className="size-8" />
      </span>
      <h2 id="lesson-end-heading" className="text-2xl font-semibold">
        You finished {lessonTitle}
      </h2>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          to="/lessons/$lessonId/test"
          params={{ lessonId }}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Take the test
        </Link>
        <Link
          to="/learn"
          className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 font-medium hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Back to the map
        </Link>
      </div>
    </section>
  );
}
