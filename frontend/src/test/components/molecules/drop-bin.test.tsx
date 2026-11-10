import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DropBin } from "@/components/molecules/drop-bin";

it("is always there so learners know where to drop", async () => {
  const screen = await render(<DropBin dragging={false} active={false} />);

  await expect.element(screen.getByText("Bin: drop a node here to delete it")).toBeInTheDocument();
});

it("says a drop will delete while a node is over it", async () => {
  const screen = await render(<DropBin dragging active />);

  await expect.element(screen.getByText("Drop to delete")).toBeInTheDocument();
});
