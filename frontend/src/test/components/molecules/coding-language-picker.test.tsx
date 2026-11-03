import { expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { CodingLanguagePicker } from "@/components/molecules/coding-language-picker";
import { codeLanguages } from "@/lib/code-languages";

it("selects Pseudocode when the language isn't one it knows", async () => {
  const screen = await render(
    <CodingLanguagePicker languages={codeLanguages} value="python" onChange={vi.fn()} />,
  );

  await screen.getByRole("button", { name: "Code language: Pseudocode" }).click();

  await expect
    .element(page.getByRole("menuitemradio", { name: "Pseudocode" }))
    .toHaveAttribute("aria-checked", "true");
});

it("marks the learner's language", async () => {
  const screen = await render(
    <CodingLanguagePicker
      languages={codeLanguages}
      value="java"
      learnerLanguage="rust"
      onChange={vi.fn()}
    />,
  );

  await screen.getByRole("button", { name: "Code language: Java" }).click();

  await expect
    .element(page.getByRole("menuitemradio", { name: "Java" }))
    .toHaveAttribute("aria-checked", "true");
  await expect
    .element(page.getByRole("menuitemradio", { name: "Rust (your language)" }))
    .toBeVisible();
});
