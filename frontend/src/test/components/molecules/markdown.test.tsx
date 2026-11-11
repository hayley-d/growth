import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Markdown } from "@/components/molecules/markdown";
import "@/index.css";

it("draws a markdown table as a real table", async () => {
  const screen = await render(
    <Markdown text={"| Order | Rhythm |\n| --- | --- |\n| Pre-order | me, left, right |"} />,
  );

  await expect.element(screen.getByRole("table")).toBeVisible();
  await expect.element(screen.getByText("Rhythm")).toBeVisible();
  expect(screen.container.querySelectorAll("th")).toHaveLength(2);
  await expect.element(screen.getByRole("cell", { name: "me, left, right" })).toBeVisible();
});
