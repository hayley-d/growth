import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Spoiler } from "@/components/molecules/spoiler";
import "@/index.css";

it("hides the answer until the bar is clicked", async () => {
  const screen = await render(
    <Spoiler label="Answer">
      <p>Smaller, bigger, sorted.</p>
    </Spoiler>,
  );

  const toggle = screen.getByRole("button", { name: "Show answer" });
  await expect.element(toggle).toHaveAttribute("aria-expanded", "false");
  await expect.element(screen.getByText("Smaller, bigger, sorted.")).not.toBeVisible();

  const bar = screen.container.querySelector("button[aria-hidden]");
  if (!(bar instanceof HTMLButtonElement)) throw new Error("No spoiler bar");
  bar.click();

  await expect.element(screen.getByText("Smaller, bigger, sorted.")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Hide answer" }))
    .toHaveAttribute("aria-expanded", "true");
});

it("shows and hides the answer with the toggle", async () => {
  const screen = await render(
    <Spoiler label="Answer">
      <p>Smaller, bigger, sorted.</p>
    </Spoiler>,
  );

  await screen.getByRole("button", { name: "Show answer" }).click();
  await expect.element(screen.getByText("Smaller, bigger, sorted.")).toBeVisible();

  await screen.getByRole("button", { name: "Hide answer" }).click();
  await expect.element(screen.getByText("Smaller, bigger, sorted.")).not.toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Show answer" })).toBeVisible();
});
