import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { LeaderboardTable } from "@/components/organisms/leaderboard-table";
import "@/index.css";

const entry = (rank: number, displayName: string, timeSeconds: number, isMe = false) => ({
  rank,
  displayName,
  timeSeconds,
  isMe,
});

it("shows a You badge and highlight on the signed-in learner", async () => {
  const screen = await render(
    <LeaderboardTable
      entries={[entry(1, "Ada", 90), entry(2, "Bea", 120, true)]}
      me={{ displayName: "Bea", rank: 2, timeSeconds: 120, hidden: false }}
    />,
  );

  const learner = screen.getByRole("cell", { name: /Bea/ });
  await expect.element(learner.getByText("You")).toBeVisible();
  await expect
    .element(screen.getByRole("cell", { name: "Ada" }).getByText("You"))
    .not.toBeInTheDocument();
  expect(learner.element().closest("tr")?.className).toContain("bg-accent/40");
});

it("pins the signed-in learner under the list when they are outside the top 10", async () => {
  const screen = await render(
    <LeaderboardTable
      entries={[entry(1, "Ada", 90)]}
      me={{ displayName: "Bea", rank: 11, timeSeconds: 400, hidden: false }}
    />,
  );

  await expect.element(screen.getByRole("cell", { name: /Bea/ }).getByText("You")).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "11" })).toBeVisible();
  await expect
    .element(screen.getByText("Only you can see this. You're hidden from the board."))
    .not.toBeInTheDocument();
});

it("shows a dash and a hidden note when the signed-in learner is hidden", async () => {
  const screen = await render(
    <LeaderboardTable
      entries={[entry(1, "Ada", 90)]}
      me={{ displayName: "Bea", rank: null, timeSeconds: 40, hidden: true }}
    />,
  );

  await expect.element(screen.getByRole("cell", { name: /Bea/ }).getByText("You")).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "–" })).toBeVisible();
  await expect
    .element(screen.getByText("Only you can see this. You're hidden from the board."))
    .toBeVisible();
});

it("shows the shared rank for a tie instead of the row index", async () => {
  const screen = await render(
    <LeaderboardTable
      entries={[entry(1, "Ada", 90), entry(1, "Bea", 90), entry(3, "Cy", 120)]}
      me={null}
    />,
  );

  const ranks = screen
    .getByRole("row")
    .elements()
    .slice(1)
    .map((row) => row.querySelector("td")?.textContent);

  expect(ranks).toEqual(["1", "1", "3"]);
});
