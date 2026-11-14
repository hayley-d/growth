import { afterEach, beforeEach, expect, it } from "vitest";

import { clearCacheOnUserSwitch } from "@/lib/clear-cache-on-user-switch";
import { authQueryKeys } from "@/lib/queries/auth.queries";
import { dailyChallengeQueryKeys } from "@/lib/queries/daily-challenge.queries";
import { queryClient } from "@/lib/query-client";

const session = (userId: string) => ({
  user: { id: userId, name: "Ada", email: "ada@example.com", role: "student" },
  session: { id: "session-1", expiresAt: new Date(Date.now() + 60_000) },
});

const finished = { data: { status: "finished" } };

let stop: () => void;

beforeEach(() => {
  queryClient.clear();
  stop = clearCacheOnUserSwitch();
});

afterEach(() => {
  stop();
  queryClient.clear();
});

it("drops the last learner's data when a different learner signs in", () => {
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));
  queryClient.setQueryData(dailyChallengeQueryKeys.all, finished);

  queryClient.setQueryData(authQueryKeys.session, session("user-2"));

  expect(queryClient.getQueryData(dailyChallengeQueryKeys.all)).toBeUndefined();
  expect(queryClient.getQueryData<ReturnType<typeof session>>(authQueryKeys.session)?.user.id).toBe(
    "user-2",
  );
});

it("drops the learner's data when they sign out", () => {
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));
  queryClient.setQueryData(dailyChallengeQueryKeys.all, finished);

  queryClient.setQueryData(authQueryKeys.session, null);

  expect(queryClient.getQueryData(dailyChallengeQueryKeys.all)).toBeUndefined();
});

it("keeps data on first sign in and when the same learner's session refreshes", () => {
  queryClient.setQueryData(dailyChallengeQueryKeys.all, finished);
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));

  expect(queryClient.getQueryData(dailyChallengeQueryKeys.all)).toEqual(finished);
});
