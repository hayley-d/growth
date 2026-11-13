import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useMemo, useState } from "react";

import type {
  AttemptQuestion,
  AttemptStateResponse,
  LearnerAnswer,
  PracticeSummary as PracticeSummaryData,
  SubmitAnswerResponse,
} from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { DifficultyMeter } from "@/components/molecules/difficulty-meter";
import { PageLoader } from "@/components/molecules/page-loader";
import { StreakCount } from "@/components/molecules/streak-count";
import { FeedbackPanel } from "@/components/organisms/feedback-panel";
import { PracticeSummary } from "@/components/organisms/practice-summary";
import { PracticeTopics, practiceFigureClass } from "@/components/organisms/practice-topics";
import { QuestionCard } from "@/components/organisms/question-card";
import { SessionTree, SessionTreeKey } from "@/components/organisms/session-tree";
import { PracticeLayout } from "@/components/templates/practice-layout";
import {
  useFinishPracticeMutation,
  useNextPracticeQuestionMutation,
  useRequestHintMutation,
  useStartPracticeMutation,
  useSubmitAnswerMutation,
} from "@/lib/mutations";
import { currentStreak, type PracticeAnswer } from "@/lib/practice/session";
import { practiceTopicDetails } from "@/lib/practice/topics";
import { usePracticeTopicsQuery } from "@/lib/queries";
import { decodeQuestionTree } from "@/lib/test/replay-steps";
import { cn } from "@/lib/utils";

type AttemptState = AttemptStateResponse["data"];

type Feedback = {
  answered: AttemptQuestion;
  response: SubmitAnswerResponse["data"];
};

const hintNote = "Hints are there to use. Each one only softens how much this answer counts.";

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
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);

  const answeredRoot = useMemo(
    () => decodeQuestionTree(feedback?.answered.tree ?? null),
    [feedback],
  );

  const question = state?.question ?? null;
  const shown = feedback?.answered ?? question;

  const reset = () => {
    setState(null);
    setFeedback(null);
    setSummary(null);
    setAnswers([]);
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

  if (summary) {
    return (
      <MotionConfig reducedMotion="user">
        <PracticeSummary summary={summary} answers={answers} onPracticeAgain={reset} />
      </MotionConfig>
    );
  }

  if (!state) {
    return (
      <PracticeLayout>
        <header className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Practice</h1>
          <p className="text-lg text-muted-foreground">
            Every answer grows a node on your own tree. Practice has no stakes and never changes
            your mastery, so guess, get it wrong, and see why.
          </p>
        </header>
        {topics.isPending ? <PageLoader /> : null}
        {topics.isError ? (
          <div role="alert" className="flex flex-col items-start gap-3">
            <p>We couldn't load the practice topics. {topics.error.message}</p>
            <Button type="button" className="min-h-11" onClick={() => topics.refetch()}>
              Try again
            </Button>
          </div>
        ) : null}
        {startPractice.isError ? (
          <p role="alert" className="text-destructive">
            {startPractice.error.message}
          </p>
        ) : null}
        {topics.isSuccess ? (
          <PracticeTopics
            topics={topics.data.data}
            isStarting={startPractice.isPending}
            onSelect={(selected) =>
              startPractice.mutate(selected, {
                onSuccess: ({ data }) => {
                  setState(data);
                  setFeedback(null);
                  setAnswers([]);
                },
              })
            }
          />
        ) : null}
      </PracticeLayout>
    );
  }

  const correct = answers.filter((answer) => answer.isCorrect).length;
  const sessionPanel = (
    <div className="flex flex-col gap-4 rounded-3xl border-2 bg-card p-5 lg:sticky lg:top-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">Your tree</h2>
        <span className="text-sm text-muted-foreground">
          {correct} of {answers.length} right
        </span>
      </div>
      <div className={cn(practiceFigureClass, "grid min-h-36 place-items-center p-4")}>
        <SessionTree answers={answers} pending={!feedback} className="max-h-56" />
      </div>
      <SessionTreeKey />
      {finishPractice.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {finishPractice.error.message}
        </p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="min-h-11 rounded-full"
        disabled={finishPractice.isPending}
        onClick={stop}
      >
        {finishPractice.isPending ? "Stopping..." : "Stop practising"}
      </Button>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <PracticeLayout aside={sessionPanel}>
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {state.attempt.topic ? practiceTopicDetails[state.attempt.topic].label : "Practice"}
          </h1>
          {shown ? <DifficultyMeter level={shown.difficulty} /> : null}
          <StreakCount streak={currentStreak(answers)} />
        </header>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={feedback ? `feedback-${feedback.answered.id}` : `question-${question?.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {feedback ? (
              <>
                {nextQuestion.isError ? (
                  <p role="alert" className="text-destructive">
                    {nextQuestion.error.message}
                  </p>
                ) : null}
                <FeedbackPanel
                  className="rounded-3xl border-2 bg-card"
                  isCorrect={feedback.response.isCorrect}
                  explanation={feedback.response.explanation}
                  replay={feedback.response.replay}
                  root={answeredRoot}
                  runKey={feedback.answered.id}
                  isLast={false}
                  nextLabel="Next question"
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
            ) : question ? (
              <QuestionCard
                question={question}
                isBusy={submitAnswer.isPending || requestHint.isPending}
                errorMessage={submitAnswer.error?.message ?? requestHint.error?.message ?? null}
                hintNote={hintNote}
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
                        setAnswers((current) => [
                          ...current,
                          { questionId: question.id, isCorrect: response.data.isCorrect },
                        ]);
                      },
                    },
                  )
                }
              />
            ) : (
              <PageLoader />
            )}
          </motion.div>
        </AnimatePresence>
      </PracticeLayout>
    </MotionConfig>
  );
}
