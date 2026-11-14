import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DashboardCard } from "@/components/molecules/dashboard-card";
import "@/index.css";

it("names the region after its title and shows the content", async () => {
  const screen = await render(
    <DashboardCard title="Leaderboard">
      <p>Some content</p>
    </DashboardCard>,
  );

  await expect
    .element(screen.getByRole("region", { name: "Leaderboard" }).getByText("Some content"))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Leaderboard", level: 2 }))
    .toBeVisible();
});
