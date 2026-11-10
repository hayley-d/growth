import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TextQuestion } from "@/components/molecules/text-question";
import "@/index.css";

it("tidies spaces and commas, shows the result, and submits it", async () => {
  const onSubmit = vi.fn();
  const screen = await render(<TextQuestion onSubmit={onSubmit} />);

  const input = screen.getByRole("textbox", { name: "Your answer" });
  await input.fill("3,1, 2");
  await expect.element(screen.getByText("Checked as: 3, 1, 2")).toBeVisible();

  await userEvent.keyboard("{Enter}");
  expect(onSubmit).toHaveBeenCalledWith({ type: "text", text: "3, 1, 2" });
});

it("keeps Submit off when the tidied answer is longer than 200 characters", async () => {
  const onSubmit = vi.fn();
  const screen = await render(<TextQuestion onSubmit={onSubmit} />);

  await screen.getByRole("textbox", { name: "Your answer" }).fill("1,".repeat(100));

  await expect.element(screen.getByText(/Too long: 300 of 200/)).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
});

it("keeps Submit off for an empty answer", async () => {
  const screen = await render(<TextQuestion onSubmit={vi.fn()} />);

  await expect.element(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
});
