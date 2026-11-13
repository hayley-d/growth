import { useMemo, useState } from "react";

import type {
  AttemptQuestion,
  AttemptStateResponse,
  LearnerAnswer,
  PracticeSummary as PracticeSummaryData,
  PracticeTopic,
  SubmitAnswerResponse,
} from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { PageLoader } from "@/components/molecules/page-loader";
import { FeedbackPanel } from "@/components/organisms/feedback-panel";
import { PracticeSummary } from "@/components/organisms/practice-summary";
import { PracticeTopics } from "@/components/organisms/practice-topics";
import { QuestionCard } from "@/components/organisms/question-card";
import { PracticeLayout } from "@/components/templates/practice-layout";
import {
  useFinishPracticeMutation,
  useNextPracticeQuestionMutation,
  useRequestHintMutation,
  useStartPracticeMutation,
  useSubmitAnswerMutation,
} from "@/lib/mutations";
import { practiceTopicDetails } from "@/lib/practice/topics";
import { usePracticeTopicsQuery } from "@/lib/queries";
import { decodeQuestionTree } from "@/lib/test/replay-steps";

type AttemptState = AttemptStateResponse["data"];

type Feedback = {
  answered: AttemptQuestion;
  response: SubmitAnswerResponse["data"];
};

export function PracticePage() {
  const topics = usePracticeTopicsQuery();
  const startPractice = useStartPracticeMutation();
  const nextQuestion = useNextPracticeQuestionMutation();
  const finishPractice = useFinishPracticeMutation();
  const requestHint = useRequestHintMutation();
  const submitAnswer = useSubmitAnswerMutation();
  const [state, setState] = useState<AttemptState | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [summary, setSummary] = useState<PracticeSummaryData | null>(null);

  const answeredRoot = useMemo(
    () => decodeQuestionTree(feedback?.answered.tree ?? null),
    [feedback],
  );

  const topic: PracticeTopic | null = state?.attempt.topic ?? null;
  const topicLabel = topic ? practiceTopicDetails[topic].label : null;
  const question = state?.question ?? null;

  const reset = () => {
    setState(null);
    setFeedback(null);
    setSummary(null);
    startPractice.reset();
    finishPractice.reset();
  };

  const stop = () => {
    if (!state) return;
    finishPractice.mutate(state.attempt.id, {
      onSuccess: ({ data }) => {
        setSummary(data);
        setState(null);
        setFeedback(null);
      },
    });
  };

  const stopButton = state ? (
    <Button
      type="button"
      variant="outline"
      className="min-h-11"
      disabled={finishPractice.isPending}
      onClick={stop}
    >
      {finishPractice.isPending ? "Stopping..." : "Stop practising"}
    </Button>
  ) : null;

  const body = (() => {
    if (summary) return <PracticeSummary summary={summary} onPracticeAgain={reset} />;

    if (!state) {
      if (topics.isPending) return <PageLoader />;
      if (topics.isError) {
        return (
          <p role="alert" className="text-muted-foreground">
            {topics.error.message}
          </p>
        );
      }
      return (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Choose a topic. You will be presented with questions until you choose to stop. Questions
            increase in difficulty as you improve. Practice has no stakes. It does not influence
            your mastery or test results. Feel free to guess, make mistakes and learn from feedback.
          </p>
          {startPractice.isError ? (
            <p role="alert" className="text-destructive">
              {startPractice.error.message}
            </p>
          ) : null}
          <PracticeTopics
            topics={topics.data.data}
            isStarting={startPractice.isPending}
            onSelect={(selected) =>
              startPractice.mutate(selected, {
                onSuccess: ({ data }) => {
                  setState(data);
                  setFeedback(null);
                },
              })
            }
          />
        </div>
      );
    }

    if (feedback) {
      return (
        <>
          {nextQuestion.isError ? (
            <p role="alert" className="text-destructive">
              {nextQuestion.error.message}
            </p>
          ) : null}
          <FeedbackPanel
            isCorrect={feedback.response.isCorrect}
            explanation={feedback.response.explanation}
            replay={feedback.response.replay}
            root={answeredRoot}
            runKey={feedback.answered.id}
            isLast={false}
            onNext={() =>
              nextQuestion.mutate(state.attempt.id, {
                onSuccess: ({ data }) => {
                  setState(data);
                  setFeedback(null);
                },
              })
            }
          />
        </>
      );
    }

    if (!question) return <PageLoader />;
    return (
      <>
        <p className="text-sm font-medium">Question {question.position}</p>
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
                  nextQuestion.reset();
                  setFeedback({ answered: question, response: response.data });
                },
              },
            )
          }
        />
        {finishPractice.isError ? (
          <p role="alert" className="text-destructive">
            {finishPractice.error.message}
          </p>
        ) : null}
      </>
    );
  })();

  return (
    <PracticeLayout topicLabel={topicLabel} action={stopButton}>
      {body}
    </PracticeLayout>
  );
}
