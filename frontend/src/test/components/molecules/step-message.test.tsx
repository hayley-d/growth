import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { StepMessage } from "@/components/molecules/step-message";

const message = "5 is smaller than 30, so go left.";

it("shows the message and where the step is", async () => {
  const screen = await render(<StepMessage message={message} stepNumber={2} stepCount={29} />);

  await expect.element(screen.getByText(message)).toBeVisible();
  expect(screen.container.textContent).toContain("Step 2");
  expect(screen.container.textContent).toContain("of 29");
  await expect
    .element(screen.getByRole("button", { name: "Listen to this step" }))
    .not.toBeInTheDocument();
});

it("reads the message out through onListen", async () => {
  const onListen = vi.fn();
  const screen = await render(
    <StepMessage message={message} stepNumber={2} stepCount={29} onListen={onListen} />,
  );

  await screen.getByRole("button", { name: "Listen to this step" }).click();

  expect(onListen).toHaveBeenCalledWith(message);
});
