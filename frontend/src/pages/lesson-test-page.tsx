import { useBlocker, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  AttemptQuestion,
  AttemptStateResponse,
  LearnerAnswer,
  SubmitAnswerResponse,
} from "@shared/schemas";
import { LeaveTestDialog } from "@/components/molecules/leave-test-dialog";
import { PageLoader } from "@/components/molecules/page-loader";
import { TestProgress } from "@/components/molecules/test-progress";
import { FeedbackPanel } from "@/components/organisms/feedback-panel";
import { QuestionCard } from "@/components/organisms/question-card";
import { TestResults } from "@/components/organisms/test-results";
import { TestLayout } from "@/components/templates/test-layout";
import {
  useRequestHintMutation,
  useStartAttemptMutation,
  useSubmitAnswerMutation,
} from "@/lib/mutations";
import { useLearningPathQuery } from "@/lib/queries";
import { decodeQuestionTree } from "@/lib/test/replay-steps";

const routeId = "/_app/_authenticated/lessons/$lessonId/test";

type AttemptState = AttemptStateResponse["data"];

type Feedback = {
  answered: AttemptQuestion;
  response: SubmitAnswerResponse["data"];
};

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

export function LessonTestPage() {
  const { lessonId } = useParams({ from: routeId });
  return <LessonTest key={lessonId} lessonId={lessonId} />;
}

type LessonTestProperties = {
  lessonId: string;
};

function LessonTest({ lessonId }: LessonTestProperties) {
  const learningPath = useLearningPathQuery();
  const startAttempt = useStartAttemptMutation();
  const requestHint = useRequestHintMutation();
  const submitAnswer = useSubmitAnswerMutation();
  const [state, setState] = useState<AttemptState | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const hasStarted = useRef(false);

  const lessonTitle =
    learningPath.data?.data.units
      .flatMap((unit) => unit.lessons)
      .find((lesson) => lesson.id === lessonId)?.title ?? null;
  const inProgress = state !== null && state.result === null && feedback?.response.result == null;
  const blocker = useBlocker({
    shouldBlockFn: () => true,
    disabled: !inProgress,
    withResolver: true,
  });
  const answeredRoot = useMemo(
    () => decodeQuestionTree(feedback?.answered.tree ?? null),
    [feedback],
  );

  const begin = () => {
    startAttempt.mutate(lessonId, {
      onSuccess: (response) => {
        setState(response.data);
        setFeedback(null);
      },
    });
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    begin();
  });

  const question = state?.question ?? null;

  const body = (() => {
    if (startAttempt.isError && !state) {
      return (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-muted-foreground">
            {startAttempt.error.message}
          </p>
          <button type="button" onClick={begin} className={buttonClass}>
            Try again
          </button>
        </div>
      );
    }
    if (!state) return <PageLoader />;
    if (state.result) {
      return (
        <>
          {startAttempt.isError ? (
            <p role="alert" className="text-destructive">
              {startAttempt.error.message}
            </p>
          ) : null}
          <TestResults result={state.result} isRetaking={startAttempt.isPending} onRetake={begin} />
        </>
      );
    }
    if (feedback) {
      return (
        <>
          <TestProgress
            questionNumber={feedback.answered.position}
            total={feedback.response.attempt.total}
          />
          <FeedbackPanel
            isCorrect={feedback.response.isCorrect}
            explanation={feedback.response.explanation}
            replay={feedback.response.replay}
            root={answeredRoot}
            runKey={feedback.answered.id}
            isLast={feedback.response.result !== null}
            onNext={() => {
              setState({
                attempt: feedback.response.attempt,
                question: feedback.response.question,
                result: feedback.response.result,
              });
              setFeedback(null);
            }}
          />
        </>
      );
    }
    if (!question) return <PageLoader />;
    return (
      <>
        <TestProgress questionNumber={question.position} total={state.attempt.total} />
        <QuestionCard
          question={question}
          isBusy={submitAnswer.isPending || requestHint.isPending}
          errorMessage={submitAnswer.error?.message ?? requestHint.error?.message ?? null}
          onHint={() =>
            requestHint.mutate(
              { attemptId: state.attempt.id, questionId: question.id },
              {
                onSuccess: ({ data }) => {
                  submitAnswer.reset();
                  setState((current) =>
                    current?.question
                      ? {
                          ...current,
                          question: {
                            ...current.question,
                            hints: [...current.question.hints, data.hint],
                            hintsRemaining: data.hintsRemaining,
                          },
                        }
                      : current,
                  );
                },
              },
            )
          }
          onSubmit={(answer: LearnerAnswer) =>
            submitAnswer.mutate(
              { attemptId: state.attempt.id, questionId: question.id, answer },
              {
                onSuccess: (response) => {
                  requestHint.reset();
                  setFeedback({ answered: question, response: response.data });
                },
              },
            )
          }
        />
      </>
    );
  })();

  return (
    <TestLayout lessonTitle={lessonTitle}>
      {body}
      <LeaveTestDialog
        open={blocker.status === "blocked"}
        onStay={() => blocker.reset?.()}
        onLeave={() => blocker.proceed?.()}
      />
    </TestLayout>
  );
}
