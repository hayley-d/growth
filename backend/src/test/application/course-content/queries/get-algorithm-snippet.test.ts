import { describe, expect, it } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeGetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import type { Algorithm } from "@/domain/course-content/algorithm";
import type { CodeLanguage } from "@/domain/course-content/code-language";
import type { CodeLine } from "@/domain/course-content/code-line";
import type { CodeSnippet } from "@/domain/course-content/code-snippet";
import { NotFoundError } from "@/domain/errors";
import type { UserProfile } from "@/domain/user/user-profile";

const algorithms: Algorithm[] = [{ id: "insert-id", code: "insert", name: "Insert" }];

const codeLanguages: CodeLanguage[] = [
  { id: "java-id", code: "java", name: "Java" },
  { id: "rust-id", code: "rust", name: "Rust" },
  { id: "pseudocode-id", code: "pseudocode", name: "Pseudocode" },
];

const snippetFor = (codeLanguageId: string): CodeSnippet => ({
  id: `insert-${codeLanguageId}`,
  algorithmId: "insert-id",
  codeLanguageId,
  source: `source in ${codeLanguageId}`,
});

const codeLines: CodeLine[] = [
  { codeSnippetId: "insert-java-id", stepKey: "insert.compare", lineNumber: 2 },
  { codeSnippetId: "insert-java-id", stepKey: "insert.go-left", lineNumber: 3 },
  { codeSnippetId: "insert-rust-id", stepKey: "insert.compare", lineNumber: 5 },
];

const profileFor = (userId: string, codeLanguageId: string | null): UserProfile => ({
  userId,
  textToSpeech: false,
  colourTheme: "default",
  showOnLeaderboard: true,
  onboardingComplete: true,
  learningStyleId: null,
  codeLanguageId,
});

const createGetAlgorithmSnippet = (
  snippets: CodeSnippet[] = codeLanguages.map((language) => snippetFor(language.id)),
) =>
  makeGetAlgorithmSnippet({
    algorithmRepository: {
      findByCode: async (code) => algorithms.find((algorithm) => algorithm.code === code) ?? null,
    },
    codeLanguageRepository: {
      findById: async (id) => codeLanguages.find((language) => language.id === id) ?? null,
      findByCode: async (code) => codeLanguages.find((language) => language.code === code) ?? null,
    },
    codeSnippetRepository: {
      findByAlgorithmIdAndCodeLanguageId: async (algorithmId, codeLanguageId) =>
        snippets.find(
          (snippet) =>
            snippet.algorithmId === algorithmId && snippet.codeLanguageId === codeLanguageId,
        ) ?? null,
    },
    codeLineRepository: {
      listByCodeSnippetId: async (codeSnippetId) =>
        codeLines.filter((codeLine) => codeLine.codeSnippetId === codeSnippetId),
    },
    userProfileRepository: {
      findById: async (userId) =>
        [profileFor("rust-learner", "rust-id"), profileFor("new-learner", null)].find(
          (profile) => profile.userId === userId,
        ) ?? null,
    },
  });

const asUser = <Result>(userId: string | undefined, callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

describe("makeGetAlgorithmSnippet", () => {
  it("returns the snippet in the language asked for, with its line map", async () => {
    await expect(
      createGetAlgorithmSnippet()({ code: "insert", language: "java" }),
    ).resolves.toEqual({
      data: {
        algorithm: { code: "insert", name: "Insert" },
        language: { code: "java", name: "Java" },
        source: "source in java-id",
        lines: { "insert.compare": 2, "insert.go-left": 3 },
      },
    });
  });

  it("prefers the language asked for over the learner's own", async () => {
    const response = await asUser("rust-learner", () =>
      createGetAlgorithmSnippet()({ code: "insert", language: "java" }),
    );
    expect(response.data.language.code).toBe("java");
  });

  it("uses the signed-in learner's language when none is asked for", async () => {
    const response = await asUser("rust-learner", () =>
      createGetAlgorithmSnippet()({ code: "insert" }),
    );
    expect(response.data.language.code).toBe("rust");
    expect(response.data.lines).toEqual({ "insert.compare": 5 });
  });

  it("falls back to pseudocode for a learner who hasn't picked a language", async () => {
    const response = await asUser("new-learner", () =>
      createGetAlgorithmSnippet()({ code: "insert" }),
    );
    expect(response.data.language.code).toBe("pseudocode");
  });

  it("falls back to pseudocode when nobody is signed in", async () => {
    const response = await asUser(undefined, () => createGetAlgorithmSnippet()({ code: "insert" }));
    expect(response.data.language.code).toBe("pseudocode");
    expect(response.data.lines).toEqual({});
  });

  it("rejects an algorithm that doesn't exist", async () => {
    await expect(createGetAlgorithmSnippet()({ code: "bubble-sort" })).rejects.toThrow(
      new NotFoundError("Algorithm not found"),
    );
  });

  it("rejects a language that doesn't exist", async () => {
    await expect(
      createGetAlgorithmSnippet()({ code: "insert", language: "python" }),
    ).rejects.toThrow(new NotFoundError("Code language not found"));
  });

  it("rejects a snippet that hasn't been written yet", async () => {
    await expect(
      createGetAlgorithmSnippet([])({ code: "insert", language: "rust" }),
    ).rejects.toThrow(new NotFoundError("There's no Rust version of Insert yet"));
  });
});
