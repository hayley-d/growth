import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { HomePage } from "@/pages/home-page";

it("shows the app name", async () => {
  const screen = await render(<HomePage />);

  await expect.element(screen.getByRole("heading", { name: "Rebalance" })).toBeVisible();
});
