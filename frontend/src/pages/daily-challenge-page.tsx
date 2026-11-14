import { Link, useBlocker } from "@tanstack/react-router";
import { ArrowRight, Lightbulb, Target, Timer, X } from "lucide-react";
import { MotionConfig } from "motion/react";
import { useCallback } from "react";

import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { DifficultyMeter } from "@/components/molecules/difficulty-meter";
import { LeaveTestDialog } from "@/components/molecules/leave-test-dialog";
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

const challengeRules = [
  { icon: Target, text: "You get one go, with no hints." },
  {
    icon: Timer,
    text: "The clock starts when you press Start the clock and stops when you answer.",
  },
  { icon: Lightbulb, text: "You'll see the answer and why once you've answered." },
];

export function DailyChallengePage() {
  const challenge = useDailyChallengeQuery();
  const startChallenge = useStartDailyChallengeMutation();
  const submitAnswer = useSubmitDailyChallengeAnswerMutation();
  const state = challenge.data?.data ?? null;
  const nextChallengeAt = state ? Date.parse(state.nextChallengeAt) : null;
  const { refetch } = challenge;
  const { reset: resetStart } = startChallenge;
  const { reset: resetAnswer } = submitAnswer;

  const blocker = useBlocker({
    shouldBlockFn: () => true,
    disabled: state?.status !== "in_progress" || submitAnswer.isPending,
    withResolver: true,
  });

  useRunAt(
    nextChallengeAt,
    useCallback(() => {
      resetStart();
      resetAnswer();
      void refetch();
    }, [refetch, resetStart, resetAnswer]),
  );

  const header = (
    <header className="flex max-w-2xl items-start gap-3">
      <Link
        to="/"
        aria-label="Leave the daily challenge"
        className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md border border-transparent hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <X aria-hidden className="size-5" />
      </Link>
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Daily challenge</h1>
        {state ? (
          <p className="text-lg text-muted-foreground">
            {dayFormat.format(new Date(`${state.date}T00:00:00.000Z`))}
          </p>
        ) : null}
      </div>
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
            <ul className="flex flex-col gap-3">
              {challengeRules.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Your time only shows on the leaderboard if you turn that on in{" "}
              <Link
                to="/settings"
                className="underline underline-offset-4 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Settings
              </Link>
              . It never changes your mastery or progress.
            </p>
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
              {startChallenge.isPending ? "Starting..." : "Start the clock"}
              <ArrowRight aria-hidden className="size-4" />
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
      <LeaveTestDialog
        open={blocker.status === "blocked"}
        onStay={() => blocker.reset?.()}
        onLeave={() => blocker.proceed?.()}
        title="Leave the daily challenge?"
        description="The clock keeps running while you're away, and you still only get one go. You can come back and finish it from the home page."
        leaveLabel="Leave"
      />
    </MotionConfig>
  );
}
