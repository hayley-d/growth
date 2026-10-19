import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { TreeLoader } from "@/components/atoms/tree-loader";
import "@/index.css";

it("announces that something is loading", async () => {
  const screen = await render(<TreeLoader label="Loading courses" />);

  await expect.element(screen.getByRole("status", { name: "Loading courses" })).toBeVisible();
});
