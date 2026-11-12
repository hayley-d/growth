import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { LessonNoteStep } from "@/components/molecules/lesson-note-step";
import { PageLoader } from "@/components/molecules/page-loader";
import { LessonEnd } from "@/components/organisms/lesson-end";
import { LessonStep } from "@/components/organisms/lesson-step";
import { LessonUnavailable } from "@/components/organisms/lesson-unavailable";
import { LessonLayout } from "@/components/templates/lesson-layout";
import { clampStep } from "@/lib/lesson/lesson-search";
import { TreeModeProvider } from "@/lib/lesson/tree-mode";
import { useSaveLessonNoteMutation } from "@/lib/mutations";
import { useLearningStylesQuery, useLessonNoteQuery, useLessonQuery } from "@/lib/queries";
import { ServiceError } from "@/services/service-error";
import { useSpeechStore } from "@/stores/speech-store";

const routeId = "/_app/_authenticated/lessons/$lessonId/";

export function LessonPage() {
  const { lessonId } = useParams({ from: routeId });
  const search = useSearch({ from: routeId });
  const navigate = useNavigate({ from: "/lessons/$lessonId/" });
  const lesson = useLessonQuery(lessonId);
  const hasNote = lesson.data?.data.lesson.notePrompt != null;
  const note = useLessonNoteQuery(lessonId, hasNote);
  const learningStyles = useLearningStylesQuery();
  const saveNote = useSaveLessonNoteMutation();
  const stopSpeech = useSpeechStore((state) => state.stop);

  const styleNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const style of learningStyles.data?.data.learningStyles ?? [])
      names[style.id] = style.name;
    return names;
  }, [learningStyles.data]);

  const contentSteps = lesson.data?.data.steps.length ?? 0;
  const totalSteps = contentSteps + (hasNote ? 1 : 0);
  const stepNumber = clampStep(search.step, totalSteps + 1);

  useEffect(() => stopSpeech, [stopSpeech]);

  if (lesson.isPending) return <PageLoader />;

  if (lesson.isError) {
    const status = lesson.error instanceof ServiceError ? lesson.error.status : 500;
    if (status === 403) return <LessonUnavailable lessonId={lessonId} reason="locked" />;
    if (status === 404) return <LessonUnavailable lessonId={lessonId} reason="missing" />;
    return (
      <LessonUnavailable
        lessonId={lessonId}
        reason="error"
        message={lesson.error.message}
        onRetry={() => lesson.refetch()}
      />
    );
  }

  const { lesson: details, unit, steps } = lesson.data.data;
  const finished = stepNumber > totalSteps;
  const goTo = (step: number) => {
    stopSpeech();
    window.scrollTo({ top: 0 });
    void navigate({ search: { step } });
  };
  const step = steps[stepNumber - 1];
  const isCheckpoint = details.kind === "checkpoint";
  const isLast = stepNumber === totalSteps;
  const takeTest = () => {
    stopSpeech();
    void navigate({ to: "/lessons/$lessonId/test", params: { lessonId } });
  };

  const body = finished ? (
    <LessonEnd lessonId={lessonId} lessonTitle={details.title} />
  ) : step ? (
    <TreeModeProvider mode={unit.treeMode}>
      <LessonStep
        key={step.position}
        step={step}
        stepNumber={stepNumber}
        objectives={stepNumber === 1 ? details.objectives : null}
        styleNames={styleNames}
      />
    </TreeModeProvider>
  ) : details.notePrompt && note.isPending ? (
    <PageLoader />
  ) : details.notePrompt ? (
    <LessonNoteStep
      prompt={details.notePrompt}
      savedBody={note.data?.data.body ?? ""}
      onSave={async (text) => {
        await saveNote.mutateAsync({ lessonId, body: text });
      }}
    />
  ) : null;

  return (
    <LessonLayout
      unitTitle={unit.title}
      lessonTitle={details.title}
      stepNumber={Math.min(stepNumber, totalSteps)}
      totalSteps={totalSteps}
      finished={finished}
      isFirst={stepNumber <= 1}
      isLast={isLast}
      lastLabel={isCheckpoint ? "Take the test" : undefined}
      onBack={() => goTo(Math.max(stepNumber - 1, 1))}
      onContinue={() => (isCheckpoint && isLast ? takeTest() : goTo(stepNumber + 1))}
    >
      {body}
    </LessonLayout>
  );
}
