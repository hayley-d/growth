import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TraceLayout } from "@/components/organisms/trace-layout";

const renderLayout = () =>
  render(
    <TraceLayout
      tree={<p>the tree</p>}
      code={<p>the code</p>}
      message={<p>the message</p>}
      controls={<button type="button">Play</button>}
    />,
  );

it("puts the tree and the code side by side on a wide screen", async () => {
  await page.viewport(1280, 800);
  const screen = await renderLayout();

  await expect.element(screen.getByText("the tree")).toBeVisible();
  await expect.element(screen.getByText("the code")).toBeVisible();
  await expect.element(screen.getByRole("tab", { name: "Tree" })).not.toBeInTheDocument();
});

it("switches between Tree and Code tabs on a phone and keeps the message on both", async () => {
  await page.viewport(375, 800);
  const screen = await renderLayout();

  await expect
    .element(screen.getByRole("tab", { name: "Tree" }))
    .toHaveAttribute("aria-selected", "true");
  await expect.element(screen.getByText("the tree")).toBeVisible();
  await expect.element(screen.getByText("the code")).not.toBeVisible();
  await expect.element(screen.getByText("the message")).toBeVisible();

  await screen.getByRole("tab", { name: "Code" }).click();

  await expect.element(screen.getByText("the code")).toBeVisible();
  await expect.element(screen.getByText("the tree")).not.toBeVisible();
  await expect.element(screen.getByText("the message")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Play" })).toBeVisible();
});
