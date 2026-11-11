import { Link, useNavigate } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";

import { ContinueCard } from "@/components/molecules/continue-card";
import { EmptyState } from "@/components/molecules/empty-state";
import { PageLoader } from "@/components/molecules/page-loader";
import { UnitProgress } from "@/components/molecules/unit-progress";
import { countCompleted } from "@/lib/learning-path/count-completed";
import { isCourseFinished } from "@/lib/learning-path/is-course-finished";
import { unitTone } from "@/lib/learning-path/unit-tone";
import { useStartLessonMutation } from "@/lib/mutations";
import { useLearningPathQuery, useSessionQuery } from "@/lib/queries";

const linkClasses =
  "inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function DashboardPage() {
  const navigate = useNavigate();
  const session = useSessionQuery();
  const learningPath = useLearningPathQuery();
  const startLesson = useStartLessonMutation();
  const firstName = session.data?.user.name.split(" ")[0];

  const heading = (
    <div>
      <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back, {firstName}.</p>
    </div>
  );

  if (learningPath.isPending) {
    return (
      <div className="flex flex-col gap-8">
        {heading}
        <PageLoader />
      </div>
    );
  }

  if (learningPath.isError) {
    return (
      <div className="flex flex-col gap-8">
        {heading}
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-muted-foreground">
            {learningPath.error.message}
          </p>
          <button type="button" onClick={() => learningPath.refetch()} className={linkClasses}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { units, progress, currentLessonId } = learningPath.data.data;
  const lessons = units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ lesson, unitTitle: unit.title })),
  );
  const allLessons = lessons.map(({ lesson }) => lesson);
  const isFinished = isCourseFinished(allLessons);
  const current = isFinished
    ? undefined
    : lessons.find(({ lesson }) => lesson.id === currentLessonId);
  const hasStarted = countCompleted(allLessons) > 0;

  return (
    <div className="flex flex-col gap-8">
      {heading}
      <section aria-labelledby="continue-learning" className="flex flex-col gap-3">
        <h2 id="continue-learning" className="text-lg font-semibold">
          {isFinished ? "Course complete" : hasStarted ? "Continue learning" : "Start learning"}
        </h2>
        {current ? (
          <ContinueCard
            unitTitle={current.unitTitle}
            lessonTitle={current.lesson.title}
            summary={current.lesson.summary}
            hasStarted={hasStarted}
            isStarting={startLesson.isPending}
            errorMessage={startLesson.isError ? startLesson.error.message : null}
            onContinue={() =>
              startLesson.mutate(current.lesson.id, {
                onSuccess: () =>
                  navigate({
                    to: "/lessons/$lessonId",
                    params: { lessonId: current.lesson.id },
                  }),
              })
            }
          />
        ) : isFinished ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border px-4 py-10 text-center">
            <PartyPopper aria-hidden className="size-8 text-primary" />
            <h3 className="text-xl font-semibold">You've finished the course</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              All {lessons.length} lessons are done. You can go back to any of them to review.
            </p>
            <Link to="/learn" className={`${linkClasses} mt-2`}>
              Review lessons
            </Link>
          </div>
        ) : (
          <EmptyState
            title="No lessons yet"
            description="Lessons show up here as soon as they are added."
          />
        )}
      </section>
      {lessons.length > 0 ? (
        <section aria-labelledby="your-progress" className="flex flex-col gap-4">
          <h2 id="your-progress" className="text-lg font-semibold">
            Your progress
          </h2>
          <UnitProgress
            title="Overall"
            progress={progress}
            tone="primary"
            completed={countCompleted(lessons.map(({ lesson }) => lesson))}
            total={lessons.length}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {units.map((unit) => (
              <UnitProgress
                key={unit.id}
                title={unit.title}
                progress={unit.progress}
                tone={unitTone(unit.position)}
                completed={countCompleted(unit.lessons)}
                total={unit.lessons.length}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
