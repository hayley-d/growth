import { expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-react";

import { PlaygroundSetupForm } from "@/components/organisms/playground-setup-form";

const choose = async (
  screen: { getByLabelText: (label: string) => Locator; getByRole: Locator["getByRole"] },
  label: string,
  option: string,
) => {
  await screen.getByLabelText(label).click();
  await screen.getByRole("option", { name: option }).click();
};

it("tells the parent each answer", async () => {
  const onAnswer = vi.fn();
  const screen = await render(
    <PlaygroundSetupForm answers={{}} onAnswer={onAnswer} onStart={vi.fn()} />,
  );

  await choose(screen, "What topic?", "Tree building");

  expect(onAnswer).toHaveBeenCalledWith("topic", "avl");
});

it("starts once every question has an answer", async () => {
  const onStart = vi.fn();
  const screen = await render(
    <PlaygroundSetupForm
      answers={{ topic: "avl", explore: "watch", start: "large", seed: 3 }}
      onAnswer={vi.fn()}
      onStart={onStart}
    />,
  );

  await expect
    .element(screen.getByRole("combobox", { name: "What tree do you want to start with?" }))
    .toHaveTextContent("A large random tree");
  await screen.getByRole("button", { name: "Start" }).click();

  expect(onStart).toHaveBeenCalledOnce();
});
