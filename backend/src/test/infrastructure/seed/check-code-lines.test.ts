import { describe, expect, it, vi } from "vitest";

import { stepKeysByAlgorithm } from "@shared/avl";
import type { Logger } from "@/application/logging/logger";
import type { CodeLine } from "@/domain/course-content/code-line";
import type { CodeSnippet } from "@/domain/course-content/code-snippet";
import {
  checkCodeLines,
  describeMissingCodeLines,
  verifyCodeLines,
} from "@/infrastructure/seed/check-code-lines";

const snippets: CodeSnippet[] = [
  { id: "search-java", algorithmId: "search-id", codeLanguageId: "java-id", source: "" },
  { id: "search-rust", algorithmId: "search-id", codeLanguageId: "rust-id", source: "" },
];

const linesFor = (codeSnippetId: string, stepKeys: readonly string[]): CodeLine[] =>
  stepKeys.map((stepKey, index) => ({ codeSnippetId, stepKey, lineNumber: index + 1 }));

const rustGap = {
  algorithm: "search",
  language: "rust",
  missing: ["search.go-left", "search.go-right", "search.not-found"],
  unknown: ["search.give-up"],
};

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createDependencies = (codeLines: CodeLine[], codeSnippets = snippets) => ({
  algorithmRepository: {
    listAll: async () => [
      { id: "search-id", code: "search", name: "Search" },
      { id: "insert-id", code: "insert", name: "Insert" },
    ],
  },
  codeLanguageRepository: {
    findById: async (id: string) => ({ id, code: id.replace("-id", ""), name: id }),
  },
  codeSnippetRepository: {
    listByAlgorithmId: async (algorithmId: string) =>
      codeSnippets.filter((snippet) => snippet.algorithmId === algorithmId),
  },
  codeLineRepository: {
    listByCodeSnippetId: async (codeSnippetId: string) =>
      codeLines.filter((codeLine) => codeLine.codeSnippetId === codeSnippetId),
  },
});

describe("checkCodeLines", () => {
  it("finds no gaps when every snippet has a line for every step", async () => {
    const codeLines = [
      ...linesFor("search-java", stepKeysByAlgorithm.search),
      ...linesFor("search-rust", stepKeysByAlgorithm.search),
    ];
    await expect(checkCodeLines(createDependencies(codeLines))).resolves.toEqual({
      snippetsChecked: 2,
      gaps: [],
    });
  });

  it("names the algorithm, language and step keys of each incomplete snippet", async () => {
    const codeLines = [
      ...linesFor("search-java", stepKeysByAlgorithm.search),
      ...linesFor("search-rust", ["search.compare", "search.found", "search.give-up"]),
    ];
    await expect(checkCodeLines(createDependencies(codeLines))).resolves.toEqual({
      snippetsChecked: 2,
      gaps: [rustGap],
    });
  });
});

describe("describeMissingCodeLines", () => {
  it("returns nothing when no step keys are missing", () => {
    expect(
      describeMissingCodeLines([
        { algorithm: "search", language: "java", missing: [], unknown: ["search.give-up"] },
      ]),
    ).toBeNull();
  });

  it("lists each snippet with missing step keys on its own line", () => {
    expect(
      describeMissingCodeLines([
        { algorithm: "search", language: "rust", missing: ["search.found"], unknown: [] },
        { algorithm: "insert", language: "java", missing: ["insert.compare"], unknown: [] },
      ]),
    ).toBe(
      [
        "Some code snippets have no line for a step the engine can emit:",
        "search (rust): search.found",
        "insert (java): insert.compare",
      ].join("\n"),
    );
  });
});

describe("verifyCodeLines", () => {
  const completeLines = [
    ...linesFor("search-java", stepKeysByAlgorithm.search),
    ...linesFor("search-rust", stepKeysByAlgorithm.search),
  ];

  it("says there is nothing to check yet when no snippets exist", async () => {
    const logger = createStubLogger();
    await verifyCodeLines(createDependencies([], []), logger);
    expect(logger.info).toHaveBeenCalledWith("No code snippets to check yet");
  });

  it("reports how many snippets it checked when every step has a line", async () => {
    const logger = createStubLogger();
    await verifyCodeLines(createDependencies(completeLines), logger);
    expect(logger.info).toHaveBeenCalledWith("Every code snippet has a line for every step", {
      snippetsChecked: 2,
    });
  });

  it("warns about lines for steps the engine never emits", async () => {
    const logger = createStubLogger();
    await verifyCodeLines(
      createDependencies([...completeLines, ...linesFor("search-java", ["search.give-up"])]),
      logger,
    );
    expect(logger.warn).toHaveBeenCalledWith(
      "Code snippet has lines for steps the engine never emits",
      { algorithm: "search", language: "java", unknown: ["search.give-up"] },
    );
  });

  it("throws, naming each gap, when a snippet is missing a line", async () => {
    const logger = createStubLogger();
    const codeLines = [
      ...linesFor("search-java", stepKeysByAlgorithm.search),
      ...linesFor("search-rust", ["search.compare", "search.found"]),
    ];
    await expect(verifyCodeLines(createDependencies(codeLines), logger)).rejects.toThrow(
      "search (rust): search.go-left, search.go-right, search.not-found",
    );
    expect(logger.info).not.toHaveBeenCalled();
  });
});
