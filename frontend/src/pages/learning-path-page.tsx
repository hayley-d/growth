import { useNavigate } from "@tanstack/react-router";

import { EmptyState } from "@/components/molecules/empty-state";
import { PageLoader } from "@/components/molecules/page-loader";
import { UnitProgress } from "@/components/molecules/unit-progress";
import { LearningPathTree } from "@/components/organisms/learning-path-tree";
import { countCompleted } from "@/lib/learning-path/count-completed";
import { isCourseFinished } from "@/lib/learning-path/is-course-finished";
import { unitTone } from "@/lib/learning-path/unit-tone";
import { useStartLessonMutation } from "@/lib/mutations";
import { useLearningPathQuery } from "@/lib/queries";

export function LearningPathPage() {
  const navigate = useNavigate();
  const learningPath = useLearningPathQuery();
  const startLesson = useStartLessonMutation();

  if (learningPath.isPending) return <PageLoader />;

  if (learningPath.isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">Learn</h1>
        <p role="alert" className="max-w-sm text-muted-foreground">
          {learningPath.error.message}
        </p>
        <button
          type="button"
          onClick={() => learningPath.refetch()}
          className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  const { units } = learningPath.data.data;

  if (!units.some((unit) => unit.lessons.length > 0)) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Learn</h1>
        <EmptyState
          title="No lessons yet"
          description="Lessons show up here as soon as they are added."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Learn</h1>
        {isCourseFinished(units.flatMap((unit) => unit.lessons)) ? (
          <p className="mt-1 text-muted-foreground">
            You've finished every lesson. Tap any node to review it.
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">Follow the line to your next lesson.</p>
        )}
      </div>
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
      <LearningPathTree
        units={units}
        isStarting={startLesson.isPending}
        errorMessage={startLesson.isError ? startLesson.error.message : null}
        onSheetChange={() => startLesson.reset()}
        onStartLesson={(lessonId) =>
          startLesson.mutate(lessonId, {
            onSuccess: () => navigate({ to: "/lessons/$lessonId", params: { lessonId } }),
          })
        }
        onReviewLesson={(lessonId) => navigate({ to: "/lessons/$lessonId", params: { lessonId } })}
        onTakeTest={(lessonId) => navigate({ to: "/lessons/$lessonId/test", params: { lessonId } })}
      />
    </div>
  );
}
