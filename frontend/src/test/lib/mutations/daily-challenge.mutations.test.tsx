import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import type { DailyChallengeStateResponse, SubmitAnswerRequest } from "@shared/schemas";
import { useSubmitDailyChallengeAnswerMutation } from "@/lib/mutations/daily-challenge.mutations";
import { leaderboardQueryKeys } from "@/lib/queries/leaderboard.queries";
import { dailyChallengeService } from "@/services/daily-challenge-service";

vi.mock("@/services/daily-challenge-service", () => ({
  dailyChallengeService: {
    submitDailyChallengeAnswer: vi.fn(),
  },
}));

const response: DailyChallengeStateResponse = {
  data: {
    date: "2026-11-14",
    nextChallengeAt: "2026-11-14T22:00:00.000Z",
    status: "finished",
    startedAt: "2026-11-14T06:00:00.000Z",
    finishedAt: "2026-11-14T06:01:05.000Z",
    question: null,
    result: null,
  },
};

const request: SubmitAnswerRequest = {
  questionId: "30000000-0000-4000-8000-000000000001",
  answer: { type: "text", text: "3" },
};

beforeEach(() => {
  vi.mocked(dailyChallengeService.submitDailyChallengeAnswer).mockReset();
});

it("invalidates the leaderboard when an answer is accepted", async () => {
  vi.mocked(dailyChallengeService.submitDailyChallengeAnswer).mockResolvedValue(response);
  const queryClient = new QueryClient();
  const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

  const { result, act } = await renderHook(() => useSubmitDailyChallengeAnswerMutation(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  await act(async () => {
    await result.current.mutateAsync(request);
  });

  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: leaderboardQueryKeys.all });
});
