import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { InfoTip } from "@/components/molecules/info-tip";

it("shows its text when tapped", async () => {
  const screen = await render(<InfoTip label="About auto-balance" text="Turn it off to rotate." />);

  await screen.getByRole("button", { name: "About auto-balance" }).click();

  await expect.element(screen.getByRole("tooltip")).toHaveTextContent("Turn it off to rotate.");
});
