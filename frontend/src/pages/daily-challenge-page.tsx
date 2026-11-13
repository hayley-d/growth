import { MotionConfig } from "motion/react";
import { useCallback } from "react";

import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { DifficultyMeter } from "@/components/molecules/difficulty-meter";
import { LiveDurationClock } from "@/components/molecules/live-duration-clock";
import { PageLoader } from "@/components/molecules/page-loader";
import { DailyChallengeSummary } from "@/components/organisms/daily-challenge-summary";
import { QuestionCard } from "@/components/organisms/question-card";
import { PracticeLayout } from "@/components/templates/practice-layout";
import { useRunAt } from "@/lib/daily-challenge/use-run-at";
import {
  useStartDailyChallengeMutation,
  useSubmitDailyChallengeAnswerMutation,
} from "@/lib/mutations";
import { useDailyChallengeQuery } from "@/lib/queries";

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export function DailyChallengePage() {
  const challenge = useDailyChallengeQuery();
  const startChallenge = useStartDailyChallengeMutation();
  const submitAnswer = useSubmitDailyChallengeAnswerMutation();
  const state = challenge.data?.data ?? null;
  const nextChallengeAt = state ? Date.parse(state.nextChallengeAt) : null;
  const { refetch } = challenge;
  const { reset: resetStart } = startChallenge;
  const { reset: resetAnswer } = submitAnswer;

  useRunAt(
    nextChallengeAt,
    useCallback(() => {
      resetStart();
      resetAnswer();
      void refetch();
    }, [refetch, resetStart, resetAnswer]),
  );

  const header = (
    <header className="flex max-w-2xl flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Daily challenge</h1>
      {state ? (
        <p className="text-lg text-muted-foreground">
          {dayFormat.format(new Date(`${state.date}T00:00:00.000Z`))}
        </p>
      ) : null}
    </header>
  );

  if (challenge.isPending) {
    return (
      <PracticeLayout>
        {header}
        <PageLoader />
      </PracticeLayout>
    );
  }

  if (challenge.isError || !state) {
    return (
      <PracticeLayout>
        {header}
        <div role="alert" className="flex flex-col items-start gap-3">
          <p>We couldn't load today's challenge. {challenge.error?.message}</p>
          <Button type="button" className="min-h-11" onClick={() => challenge.refetch()}>
            Try again
          </Button>
        </div>
      </PracticeLayout>
    );
  }

  const question = state.question;

  return (
    <MotionConfig reducedMotion="user">
      <PracticeLayout>
        {header}
        {state.status === "not_started" ? (
          <section
            aria-labelledby="daily-start-heading"
            className="flex max-w-2xl flex-col items-start gap-4 rounded-3xl border-2 bg-card p-6"
          >
            <h2 id="daily-start-heading" className="text-xl font-semibold">
              One question, the same for everyone
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>You get one go, with no hints.</li>
              <li>The clock starts when you press Start and stops when you answer.</li>
              <li>You'll see the answer and why once you've answered.</li>
            </ul>
            {startChallenge.isError ? (
              <p role="alert" className="text-destructive">
                {startChallenge.error.message}
              </p>
            ) : null}
            <Button
              type="button"
              className="min-h-11 rounded-full px-8"
              disabled={startChallenge.isPending}
              onClick={() => startChallenge.mutate()}
            >
              {startChallenge.isPending ? "Starting..." : "Start"}
            </Button>
          </section>
        ) : null}
        {state.status === "in_progress" && question ? (
          <>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <DifficultyMeter level={question.difficulty} />
              {state.startedAt ? (
                <LiveDurationClock label="Time" since={Date.parse(state.startedAt)} />
              ) : null}
            </div>
            <QuestionCard
              className="rounded-3xl border-2 bg-card p-5 sm:p-6"
              question={question}
              isBusy={submitAnswer.isPending}
              errorMessage={submitAnswer.error?.message ?? null}
              onSubmit={(answer: LearnerAnswer) =>
                submitAnswer.mutate({ questionId: question.id, answer })
              }
            />
          </>
        ) : null}
        {state.status === "finished" && state.result ? (
          <DailyChallengeSummary
            date={state.date}
            result={state.result}
            nextChallengeAt={nextChallengeAt ?? Date.now()}
          />
        ) : null}
      </PracticeLayout>
    </MotionConfig>
  );
}
