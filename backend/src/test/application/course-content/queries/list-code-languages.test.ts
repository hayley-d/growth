import { describe, expect, it } from "vitest";

import { makeListCodeLanguages } from "@/application/course-content/queries/list-code-languages";

describe("makeListCodeLanguages", () => {
  it("lists the code languages", async () => {
    const codeLanguage = { id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01", code: "java", name: "Java" };
    const listCodeLanguages = makeListCodeLanguages({
      codeLanguageRepository: { listAll: async () => [codeLanguage] },
    });
    await expect(listCodeLanguages()).resolves.toEqual({
      data: { codeLanguages: [codeLanguage] },
    });
  });
});
