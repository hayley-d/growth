import { expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { CodeTrace, type CodeTraceStep } from "@/components/organisms/code-trace";

const insertSnippet = {
  source: ["function insert(node, key)", "  compare key with node.key", "  if key < node.key"].join(
    "\n",
  ),
  lines: { "insert.compare": 2, "insert.go-left": 3 },
};

const rotateSnippet = {
  source: ["function rotateRight(node)", "  pivot = node.left"].join("\n"),
  lines: { "rotate-right.pick-pivot": 2 },
};

const compareStep: CodeTraceStep = {
  stepKey: "insert.compare",
  variables: { key: 5, node: 30 },
  callStack: [{ algorithm: "insert", node: 30 }],
};

const goLeftStep: CodeTraceStep = {
  stepKey: "insert.go-left",
  variables: { key: 5, node: 30 },
  callStack: [{ algorithm: "insert", node: 30 }],
};

const currentLineOf = (element: Element) =>
  element.querySelector('[aria-current="step"]')?.textContent ?? null;

const renderTrace = (step: CodeTraceStep | null, overrides = {}) =>
  render(
    <CodeTrace
      step={step}
      snippets={{ insert: insertSnippet, "rotate-right": rotateSnippet }}
      language="pseudocode"
      learnerLanguage="pseudocode"
      onLanguageChange={vi.fn()}
      {...overrides}
    />,
  );

it("marks the line for the step key and moves it when the step changes", async () => {
  const screen = await renderTrace(compareStep);
  const listing = screen.getByRole("list", { name: "insert in Pseudocode" });

  await expect.element(listing).toBeVisible();
  expect(currentLineOf(listing.element())).toContain("Line 2");

  await screen.rerender(
    <CodeTrace
      step={goLeftStep}
      snippets={{ insert: insertSnippet }}
      language="pseudocode"
      onLanguageChange={vi.fn()}
    />,
  );

  expect(currentLineOf(listing.element())).toContain("Line 3");
});

it("shows the snippet for the algorithm named in the step key", async () => {
  const screen = await renderTrace({
    stepKey: "rotate-right.pick-pivot",
    variables: { node: 20, pivot: 10 },
    callStack: [
      { algorithm: "insert", node: 30 },
      { algorithm: "rotate-right", node: 20 },
    ],
  });

  await expect
    .element(screen.getByRole("list", { name: "rotateRight in Pseudocode" }))
    .toBeVisible();
  await expect.element(screen.getByText("rotateRight(20)")).toBeVisible();
});

it("calls back with the language the learner picks", async () => {
  const onLanguageChange = vi.fn();
  const screen = await renderTrace(compareStep, { onLanguageChange });

  await screen.getByRole("radio", { name: "Java" }).click();

  expect(onLanguageChange).toHaveBeenCalledWith("java");
  await expect
    .element(screen.getByRole("radio", { name: "Pseudocode (your language)" }))
    .toBeChecked();
});

it("marks no line for a step key the snippet has no line for", async () => {
  const screen = await renderTrace({ ...compareStep, stepKey: "insert.duplicate" });
  const listing = screen.getByRole("list", { name: "insert in Pseudocode" });

  await expect.element(listing).toBeVisible();
  expect(currentLineOf(listing.element())).toBeNull();
});

it("says so when there is no code for that algorithm in the language", async () => {
  const screen = await renderTrace(
    { stepKey: "rebalance.check", variables: { node: 20, balance: 2 }, callStack: [] },
    { language: "rust" },
  );

  await expect.element(screen.getByText("There's no Rust code for rebalance yet.")).toBeVisible();
  await expect.element(screen.getByText("Nothing is running.")).toBeVisible();
});

it("writes empty values the way the language does", async () => {
  const screen = await renderTrace(
    {
      stepKey: "insert.create-node",
      variables: { key: 5, child: null },
      callStack: [{ algorithm: "insert", node: null }],
    },
    { language: "rust" },
  );

  await expect.element(screen.getByText("insert(None)")).toBeVisible();
  await expect.element(screen.getByRole("row", { name: "child None" })).toBeVisible();
});

it("flags variables that changed since the last step", async () => {
  const screen = await renderTrace(compareStep, { previousVariables: { key: 5, node: 20 } });

  await expect.element(screen.getByRole("row", { name: "node changed to 30" })).toBeVisible();
  await expect.element(screen.getByRole("row", { name: "key 5" })).toBeVisible();
});

it("asks for an operation before there is a step", async () => {
  const screen = await renderTrace(null);

  await expect.element(screen.getByText("Pick an operation to see its code run.")).toBeVisible();
});

it("scrolls long lines inside the panel, not the page", async () => {
  await page.viewport(375, 800);
  await renderTrace(compareStep, {
    snippets: {
      insert: {
        source: `function insert(node, key)\n  compare ${"key with node.key ".repeat(20)}`,
        lines: { "insert.compare": 2 },
      },
    },
  });

  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
});

it("says when the step has no line in the code", async () => {
  const screen = await renderTrace({
    stepKey: "insert.check-empty",
    variables: { key: 5, node: 30 },
    callStack: [{ algorithm: "insert", node: 30 }],
  });

  await expect
    .element(screen.getByText("This step has no line in the Pseudocode code."))
    .toBeVisible();
  expect(
    screen
      .getByRole("list", { name: "insert in Pseudocode" })
      .element()
      .querySelector('[aria-current="step"]'),
  ).toBeNull();
});

it("shows no note when the step has a line", async () => {
  const screen = await renderTrace(compareStep);

  await expect.element(screen.getByRole("list", { name: "insert in Pseudocode" })).toBeVisible();
  await expect
    .element(screen.getByText("This step has no line in the Pseudocode code."))
    .not.toBeInTheDocument();
});
