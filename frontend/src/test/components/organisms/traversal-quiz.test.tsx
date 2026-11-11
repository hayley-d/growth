import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TraversalQuiz } from "@/components/organisms/traversal-quiz";
import "@/index.css";

const keys = [30, 15, 45, 10, 20, 40];

const renderQuiz = () =>
  render(
    <div className="w-[640px]">
      <TraversalQuiz startingKeys={keys} orders={["preorder", "inorder", "postorder"]} />
    </div>,
  );

it("shows the tree and a box for each order", async () => {
  const screen = await renderQuiz();

  await expect
    .element(screen.getByRole("img", { name: "Tree with keys 30, 15, 45, 10, 20, 40" }))
    .toBeVisible();
  await expect.element(screen.getByLabelText("Pre-order")).toBeVisible();
  await expect.element(screen.getByLabelText("In-order")).toBeVisible();
  await expect.element(screen.getByLabelText("Post-order")).toBeVisible();
});

it("marks each answer right or wrong when checked", async () => {
  const screen = await renderQuiz();

  await userEvent.fill(screen.getByLabelText("Pre-order"), "30, 15, 10, 20, 45, 40");
  await userEvent.fill(screen.getByLabelText("In-order"), "10 15 20 30 40 45");
  await userEvent.fill(screen.getByLabelText("Post-order"), "10, 15, 20, 40, 45, 30");
  await screen.getByRole("button", { name: "Check" }).click();

  await expect.element(screen.getByText("Correct.").first()).toBeVisible();
  expect(screen.getByText("Correct.").all()).toHaveLength(2);
  await expect.element(screen.getByText("Not quite. Try again.")).toBeVisible();
  await expect.element(screen.getByLabelText("Post-order")).toHaveAttribute("aria-invalid", "true");
});

it("asks for keys when the answer isn't a list of keys", async () => {
  const screen = await renderQuiz();

  await userEvent.fill(screen.getByLabelText("Pre-order"), "thirty");
  await screen.getByRole("button", { name: "Check" }).click();

  await expect
    .element(screen.getByText("Type the keys with commas or spaces between them.").first())
    .toBeVisible();
});

it("shows the answers after a wrong check", async () => {
  const screen = await renderQuiz();

  await screen.getByRole("button", { name: "Check" }).click();
  await screen.getByRole("button", { name: "Show answers" }).click();

  await expect.element(screen.getByText("30, 15, 10, 20, 45, 40")).toBeVisible();
  await expect.element(screen.getByText("10, 15, 20, 30, 40, 45")).toBeVisible();
  await expect.element(screen.getByText("10, 20, 15, 40, 45, 30")).toBeVisible();
});
