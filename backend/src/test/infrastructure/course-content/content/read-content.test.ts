import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { readContent } from "@/infrastructure/course-content/content/read-content";

const fixtures = fileURLToPath(new URL("fixtures", import.meta.url));

describe("readContent", () => {
  it("reads every kind of content file under the root", async () => {
    const raw = await readContent(fixtures);

    expect(raw.units?.file).toBe("units.ts");
    expect(raw.lessons).toHaveLength(1);
    const [lesson] = raw.lessons;
    expect(lesson?.lesson.file).toBe("01-binary-tree/lesson.ts");
    expect(lesson?.blocks.map((block) => [block.file, block.format])).toEqual([
      ["01-binary-tree/blocks/01-intro-visual.ts", "module"],
      ["01-binary-tree/blocks/01-intro.md", "markdown"],
      ["01-binary-tree/blocks/02-trace.ts", "module"],
    ]);
    expect(lesson?.questions?.file).toBe("01-binary-tree/questions.ts");
    expect(lesson?.generated?.file).toBe("01-binary-tree/generated.ts");
    expect(raw.snippets).toEqual([
      expect.objectContaining({
        file: "snippets/preorder/pseudocode.txt",
        algorithm: "preorder",
        language: "pseudocode",
      }),
    ]);
    expect(raw.caseStudies.map((caseStudy) => caseStudy.file)).toEqual([
      "case-studies/family-tree.ts",
    ]);
    expect(raw.strayFiles).toEqual([]);
  });

  it("returns empty content for an empty folder", async () => {
    const raw = await readContent(fileURLToPath(new URL("fixtures/snippets", import.meta.url)));
    expect(raw.units).toBeNull();
    expect(raw.lessons).toEqual([]);
  });
});
