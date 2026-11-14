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
  isMe,
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
  const leaderboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/leaderboard",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, dailyRoute, leaderboardRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

it("links to the leaderboard when the request failed", async () => {
  const screen = await renderCard(null);

  await expect.element(screen.getByText("We couldn't load the leaderboard here.")).toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "Open the leaderboard" }))
    .toHaveAttribute("href", "/leaderboard");
});

it("links to today's challenge when the learner has not finished", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90)],
    me: null,
  });

  await expect
    .element(screen.getByText("Finish today's challenge to get on the board."))
    .toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "Take today's challenge" }))
    .toHaveAttribute("href", "/daily");
});

it("says the learner is hidden and links to the leaderboard", async () => {
  const screen = await renderCard({
    top: [entry(1, "Ada", 90)],
    me: { displayName: "Bea", rank: null, timeSeconds: 90, hidden: true },
  });

  await expect
    .element(screen.getByText("You finished in 1 minute 30 seconds. You're hidden from the board."))
    .toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "View the leaderboard" }))
    .toHaveAttribute("href", "/leaderboard");
});

it("shows today's place, the top 3, and a You badge", async () => {
  const screen = await renderCard({
    top: [
      entry(1, "Ada", 90),
      entry(2, "Bea", 120, true),
      entry(3, "Cy", 150),
      entry(4, "Dee", 180),
    ],
    me: { displayName: "Bea", rank: 2, timeSeconds: 120, hidden: false },
  });

  await expect.element(screen.getByText("You're #2 today")).toBeVisible();
  await expect.element(screen.getByText("Your time")).toBeVisible();
  await expect.element(screen.getByText("2 minutes")).toBeInTheDocument();
  const standings = screen.getByRole("list");
  await expect.element(standings.getByText("Ada")).toBeVisible();
  await expect.element(standings.getByText("You", { exact: true })).toBeVisible();
  await expect.element(standings.getByText("Cy")).toBeVisible();
  await expect.element(screen.getByText("Dee")).not.toBeInTheDocument();
  expect(screen.getByRole("listitem").elements()).toHaveLength(3);
  await expect
    .element(screen.getByRole("link", { name: "View the leaderboard" }))
    .toHaveAttribute("href", "/leaderboard");
});
