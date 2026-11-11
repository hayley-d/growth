import { beforeEach, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { TextBlock } from "@/components/organisms/text-block";
import { useWritingStore } from "@/stores/writing-store";
import "@/index.css";

beforeEach(() => {
  useWritingStore.setState({ written: {} });
});

it("gives a box to write in that keeps the text when it comes back", async () => {
  const first = await render(<TextBlock id="block-1" markdown="Write the stack." write />);
  await first.getByRole("textbox", { name: "Your answer" }).fill("postorder(40)");
  await first.unmount();

  const second = await render(<TextBlock id="block-1" markdown="Write the stack." write />);
  await expect
    .element(second.getByRole("textbox", { name: "Your answer" }))
    .toHaveValue("postorder(40)");
});

it("hides the answer behind a spoiler", async () => {
  const screen = await render(
    <TextBlock id="block-2" markdown="Fill in the gaps." write answer="Smaller, bigger, sorted." />,
  );

  await expect.element(screen.getByText("Smaller, bigger, sorted.")).not.toBeVisible();
  await screen.getByRole("button", { name: "Show answer" }).click();
  await expect.element(screen.getByText("Smaller, bigger, sorted.")).toBeVisible();
});

it("shows no box and no answer when the block asks for neither", async () => {
  const screen = await render(<TextBlock id="block-3" markdown="Just reading." />);

  await expect.element(screen.getByText("Just reading.")).toBeVisible();
  expect(screen.container.querySelector("textarea")).toBeNull();
  expect(screen.container.textContent).not.toContain("Show answer");
});
