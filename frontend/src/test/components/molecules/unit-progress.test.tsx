import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { UnitProgress } from "@/components/molecules/unit-progress";

it("shows the unit title and its progress", async () => {
  const screen = await render(<UnitProgress title="AVL trees" progress={33} unit="secondary" />);

  await expect.element(screen.getByText("AVL trees")).toBeVisible();
  await expect.element(screen.getByText("33%")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "AVL trees progress" }))
    .toHaveAttribute("aria-valuenow", "33");
});
