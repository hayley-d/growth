import { describe, expect, it } from "vitest";

import {
  algorithmParamsSchema,
  algorithmSnippetQuerySchema,
  toAlgorithmSnippetResponse,
  toListAlgorithmsResponse,
} from "@shared/schemas/algorithm";

describe("algorithmSnippetQuerySchema", () => {
  it("allows the language to be left out", () => {
    expect(algorithmSnippetQuerySchema.parse({})).toEqual({});
  });

  it.each(["", "Java", "in sert", "a".repeat(65)])("rejects %j as a language", (language) => {
    expect(algorithmSnippetQuerySchema.safeParse({ language }).success).toBe(false);
  });
});

describe("algorithmParamsSchema", () => {
  it("accepts a lower case code with hyphens", () => {
    expect(algorithmParamsSchema.parse({ code: "rotate-left" })).toEqual({ code: "rotate-left" });
  });

  it("rejects a code that is too long", () => {
    expect(algorithmParamsSchema.safeParse({ code: "a".repeat(65) }).success).toBe(false);
  });
});

describe("toListAlgorithmsResponse", () => {
  it("returns only the code and name of each algorithm", () => {
    const algorithm = { id: "algorithm-1", code: "insert", name: "Insert" };
    expect(toListAlgorithmsResponse([algorithm])).toEqual({
      data: { algorithms: [{ code: "insert", name: "Insert" }] },
    });
  });
});

describe("toAlgorithmSnippetResponse", () => {
  const source = {
    algorithm: { id: "algorithm-1", code: "insert", name: "Insert" },
    language: { id: "language-1", code: "java", name: "Java" },
    snippet: { id: "snippet-1", algorithmId: "algorithm-1", source: "void insert() {}" },
    codeLines: [
      { codeSnippetId: "snippet-1", stepKey: "insert.compare", lineNumber: 3 },
      { codeSnippetId: "snippet-1", stepKey: "insert.go-left", lineNumber: 4 },
    ],
  };

  it("turns the code lines into a map from step key to line number", () => {
    expect(toAlgorithmSnippetResponse(source)).toEqual({
      data: {
        algorithm: { code: "insert", name: "Insert" },
        language: { code: "java", name: "Java" },
        source: "void insert() {}",
        lines: { "insert.compare": 3, "insert.go-left": 4 },
      },
    });
  });

  it("returns an empty map for a snippet with no lines", () => {
    expect(toAlgorithmSnippetResponse({ ...source, codeLines: [] }).data.lines).toEqual({});
  });
});
