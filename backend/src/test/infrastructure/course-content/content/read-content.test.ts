import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

import { readContent } from "@/infrastructure/course-content/content/read-content";

const fixtures = fileURLToPath(new URL("fixtures", import.meta.url));

const brokenFiles: Record<string, string> = {
  "01-broken/lesson.ts": 'export default { key: "broken" };\n',
  "01-broken/blocks/01-intro.mdx": "---\nposition: 1\n---\nHello\n",
  "01-broken/notes.txt": "draft\n",
  "01-broken/questions.ts": "export default [\n",
  "case-studies/broken.ts": "export default {\n",
};

const temporaryRoots: string[] = [];

const writeBrokenContent = async () => {
  const root = await mkdtemp(join(tmpdir(), "growth-content-"));
  temporaryRoots.push(root);
  for (const [file, text] of Object.entries(brokenFiles)) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), text);
  }
  return root;
};

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

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
    expect(raw.unknownFiles).toEqual([]);
    expect(raw.unreadableFiles).toEqual([]);
  });

  it("lists unknown files and every file that fails to load", async () => {
    const raw = await readContent(await writeBrokenContent());

    expect(raw.unknownFiles).toEqual(["01-broken/blocks/01-intro.mdx", "01-broken/notes.txt"]);
    expect(raw.unreadableFiles.map((unreadable) => unreadable.file)).toEqual([
      "01-broken/questions.ts",
      "case-studies/broken.ts",
    ]);
    expect(raw.lessons.map((lesson) => lesson.lesson.file)).toEqual(["01-broken/lesson.ts"]);
    expect(raw.lessons[0]?.questions).toBeNull();
  });

  it("returns empty content for an empty folder", async () => {
    const raw = await readContent(fileURLToPath(new URL("fixtures/snippets", import.meta.url)));
    expect(raw.units).toBeNull();
    expect(raw.lessons).toEqual([]);
  });
});
