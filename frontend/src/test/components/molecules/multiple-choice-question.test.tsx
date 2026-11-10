import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { MultipleChoiceQuestion } from "@/components/molecules/multiple-choice-question";
import "@/index.css";

const options = [
  { id: "7b2c0e1a-4f3d-4b8e-9a6c-1d2e3f4a5b6c", text: "In-order" },
  { id: "8c3d1f2b-5a4e-4c9f-8b7d-2e3f4a5b6c7d", text: "Pre-order" },
];

it("submits the chosen option and keeps Submit off until one is chosen", async () => {
  const onSubmit = vi.fn();
  const screen = await render(<MultipleChoiceQuestion options={options} onSubmit={onSubmit} />);

  const submit = screen.getByRole("button", { name: "Submit" });
  await expect.element(submit).toBeDisabled();

  await screen.getByRole("radio", { name: "Pre-order" }).click();
  await submit.click();

  expect(onSubmit).toHaveBeenCalledWith({ type: "multiple_choice", optionId: options[1]?.id });
});

it("locks every option when disabled", async () => {
  const screen = await render(
    <MultipleChoiceQuestion options={options} disabled onSubmit={vi.fn()} />,
  );

  await expect.element(screen.getByRole("radio", { name: "In-order" })).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
});
