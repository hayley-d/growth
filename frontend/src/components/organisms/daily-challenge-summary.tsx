import { CalendarClock, Star } from "lucide-react";
import { useMemo } from "react";

import type { DailyChallengeResult } from "@shared/schemas";
import { DurationClock, LiveDurationClock } from "@/components/molecules/duration-clock";
import { FeedbackPanel } from "@/components/organisms/feedback-panel";
import { decodeQuestionTree } from "@/lib/test/replay-steps";

type DailyChallengeSummaryProperties = {
  date: string;
  result: DailyChallengeResult;
  nextChallengeAt: number;
};

export function DailyChallengeSummary({
  date,
  result,
  nextChallengeAt,
}: DailyChallengeSummaryProperties) {
  const root = useMemo(() => decodeQuestionTree(result.tree), [result.tree]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg font-medium">{result.prompt}</p>
      <FeedbackPanel
        className="rounded-3xl border-2 bg-card"
        isCorrect={result.isCorrect}
        explanation={result.explanation}
        replay={result.replay}
        root={root}
        runKey={`daily-${date}`}
        isLast={false}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t pt-4">
          <p className="flex items-center gap-2">
            <Star aria-hidden className="size-4 shrink-0" />
            <span className="text-sm text-muted-foreground">Points</span>
            <span className="font-semibold tabular-nums">{result.points}</span>
          </p>
          <DurationClock label="Your time" seconds={result.timeTakenSeconds} />
        </div>
      </FeedbackPanel>
      <section
        aria-labelledby="next-challenge-heading"
        className="flex flex-col gap-2 rounded-3xl border-2 border-dashed p-5"
      >
        <h2 id="next-challenge-heading" className="flex items-center gap-2 font-semibold">
          <CalendarClock aria-hidden className="size-5" />
          Next challenge
        </h2>
        <LiveDurationClock label="Starts in" until={nextChallengeAt} />
        <p className="text-sm text-muted-foreground">
          A new question opens at midnight, South African time.
        </p>
      </section>
    </div>
  );
}
