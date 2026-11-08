import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { CodingLanguagePicker } from "@/components/molecules/coding-language-picker";
import { codeLanguages } from "@/lib/code-languages";

it("selects Pseudocode when the language isn't one it knows", async () => {
  const screen = await render(
    <CodingLanguagePicker languages={codeLanguages} value="python" onChange={vi.fn()} />,
  );

  await expect.element(screen.getByRole("radio", { name: "Pseudocode" })).toBeChecked();
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

  await expect.element(screen.getByRole("radio", { name: "Java" })).toBeChecked();
  await expect.element(screen.getByRole("radio", { name: "Rust (your language)" })).toBeVisible();
});
