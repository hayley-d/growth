import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { LeaderboardResponse } from "@shared/schemas";
import { LeaderboardCard } from "@/components/organisms/leaderboard-card";
import { queryClient } from "@/lib/query-client";
import "@/index.css";

const entry = (rank: number, displayName: string, timeSeconds: number, isMe = false) => ({
  rank,
  displayName,
  timeSeconds,
  points: 30,
  isMe,
});

const me = (overrides: Partial<NonNullable<LeaderboardResponse["data"]["me"]>> = {}) => ({
  displayName: "Bea",
  rank: 2,
  timeSeconds: 120,
  points: 30,
  passed: true,
  hidden: false,
  ...overrides,
});

const renderCard = (data: LeaderboardResponse["data"] | null) => {
  queryClient.clear();
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <LeaderboardCard data={data} />
        <Outlet />
      </>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => null,
  });
  const dailyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/daily",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, dailyRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

it("says the board couldn't load when the request failed", async () => {
  const screen = await renderCard(null);

  await expect.element(screen.getByText("We couldn't load the leaderboard here.")).toBeVisible();
});

it("shows the board and a prompt when the learner has not finished", async () => {
  const screen = await renderCard({ top: [entry(1, "Ada", 90)], me: null });

  await expect
    .element(screen.getByText("Finish today's challenge to get on the board."))
    .toBeVisible();
  await expect.element(screen.getByText("Ada")).toBeVisible();
});

it("says so when nobody has finished", async () => {
  const screen = await renderCard({ top: [], me: null });

  await expect
    .element(screen.getByText("Nobody has finished today's challenge yet."))
    .toBeVisible();
});

it("tells a learner who did not pass to come back tomorrow", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90)],
    me: me({ rank: null, passed: false, points: 0 }),
  });

  await expect
    .element(screen.getByText("You didn't pass today's challenge. Come back tomorrow."))
    .toBeVisible();
});

it("does not say nobody has finished when the only finisher did not pass", async () => {
  const screen = await renderCard({
    top: [],
    me: me({ rank: null, passed: false, points: 0 }),
  });

  await expect
    .element(screen.getByText("You didn't pass today's challenge. Come back tomorrow."))
    .toBeVisible();
  await expect
    .element(screen.getByText("Nobody has finished today's challenge yet."))
    .not.toBeInTheDocument();
});

it("names the scrolling rankings so assistive technology can find them", async () => {
  const screen = await renderCard({ top: [entry(1, "Ada", 90)], me: null });

  await expect.element(screen.getByRole("region", { name: "Today's rankings" })).toBeVisible();
});

it("keeps rows apart when two learners have the same name, time and points", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90), entry(1, "Ada", 90)],
    me: null,
  });

  expect(screen.getByRole("row").elements()).toHaveLength(3);
});

it("says the learner is hidden but still shows the board", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90)],
    me: me({ rank: null, hidden: true }),
  });

  await expect
    .element(screen.getByText("You finished in 2 minutes. You're hidden from the board."))
    .toBeVisible();
  await expect.element(screen.getByText("Ada")).toBeVisible();
});

it("lists rank, name, time and points with a You badge", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90), entry(2, "Bea", 120, true)],
    me: me(),
  });

  await expect.element(screen.getByRole("columnheader", { name: "Rank" })).toBeVisible();
  await expect.element(screen.getByRole("columnheader", { name: "Points" })).toBeVisible();
  await expect.element(screen.getByText("1 minute 30 seconds")).toBeInTheDocument();
  await expect.element(screen.getByText("You", { exact: true })).toBeVisible();
  expect(screen.getByRole("row").elements()).toHaveLength(3);
});

it("pins the learner's row when they rank outside the top", async () => {
  const top = Array.from({ length: 10 }, (_, index) =>
    entry(index + 1, `Learner ${index + 1}`, 60 + index),
  );
  const screen = await renderCard({ top, me: me({ displayName: "Zed", rank: 12 }) });

  await expect.element(screen.getByRole("row", { name: /Zed/ })).toBeInTheDocument();
  await expect.element(screen.getByText("You", { exact: true })).toBeInTheDocument();
  expect(screen.getByRole("row").elements()).toHaveLength(12);
});
