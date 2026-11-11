import { describe, expect, it } from "vitest";

import {
  type ContentProblem,
  checkContent,
  minimumGeneratedQuestions,
} from "@/infrastructure/course-content/content/check-content";
import type { RawContent } from "@/infrastructure/course-content/content/read-content";

const lessonFile = "01-intro/lesson.ts";
const questionsFile = "01-intro/questions.ts";
const generatedFile = "01-intro/generated.ts";

const preorderSnippet = [
  "if empty // @step preorder.check-empty",
  "return // @step preorder.empty",
  "visit // @step preorder.visit",
  "left // @step preorder.go-left",
  "right // @step preorder.go-right",
].join("\n");

const multipleChoice = {
  key: "root",
  type: "multiple_choice",
  difficulty: 1,
  bloomsLevel: "remember",
  prompt: "Which node is the root?",
  explanation: "The root has no parent.",
  reviewLesson: "intro",
  hints: ["Look up.", "No parent."],
  options: [
    { key: "a", text: "20", isCorrect: true },
    { key: "b", text: "10", isCorrect: false },
  ],
};

const orderNodes = {
  key: "order",
  type: "order_nodes",
  difficulty: 2,
  bloomsLevel: "apply",
  prompt: "Tap the nodes in pre-order.",
  explanation: "Root, left, right.",
  reviewLesson: "intro",
  hints: ["Root first.", "Then left."],
  tree: "20,10,#,#,30,#,#",
  answer: { type: "order_nodes", keys: [20, 10, 30] },
};

const generatedQuestion = (key: string) => ({
  key,
  generatorKey: "height",
  type: "text",
  difficulty: 1,
  bloomsLevel: "apply",
  reviewLesson: "intro",
});

const validRaw = (): RawContent =>
  structuredClone<RawContent>({
    units: { file: "units.ts", data: [{ key: "basics", position: 1, title: "Basics" }] },
    lessons: [
      {
        folder: "01-intro",
        lesson: {
          file: lessonFile,
          data: {
            key: "intro",
            unit: "basics",
            position: 1,
            title: "Intro",
            summary: "The first lesson.",
            kind: "lesson",
            objectives: ["Name a root"],
          },
        },
        blocks: [
          {
            file: "01-intro/blocks/01-text.md",
            format: "markdown",
            text: "---\nposition: 1\ntranscript: Hello.\n---\nHello.",
          },
          {
            file: "01-intro/blocks/01-visual.ts",
            format: "module",
            data: {
              type: "diagram",
              position: 1,
              style: "visual",
              transcript: "A tree.",
              body: { startingKeys: [20], highlights: [], caption: "A tree." },
            },
          },
        ],
        questions: { file: questionsFile, data: [multipleChoice, orderNodes] },
        generated: { file: generatedFile, data: [generatedQuestion("height-one")] },
      },
    ],
    snippets: [
      {
        file: "snippets/preorder/java.java",
        algorithm: "preorder",
        language: "java",
        text: preorderSnippet,
      },
    ],
    caseStudies: [
      {
        file: "case-studies/garden.ts",
        data: {
          key: "garden",
          lesson: "intro",
          position: 1,
          title: "Garden",
          scenario: "A garden.",
          body: "Plant keys.",
          task: {
            startingKeys: [],
            allowedOperations: ["insert"],
            instructions: "Insert 1.",
            goal: { kind: "validAvl" },
          },
        },
      },
    ],
    strayFiles: [],
    unknownFiles: [],
    unreadableFiles: [],
  });

type Mutable = {
  units: { data: Record<string, unknown>[] };
  lessons: {
    lesson: { file: string; data: Record<string, unknown> };
    blocks: Record<string, unknown>[];
    questions: { data: Record<string, unknown>[] };
    generated: { data: Record<string, unknown>[] };
  }[];
  snippets: { file: string; algorithm: string; language: string; text: string }[];
  caseStudies: { data: Record<string, unknown> }[];
  strayFiles: string[];
  unknownFiles: string[];
  unreadableFiles: { file: string; reason: string }[];
};

const problemsAfter = (change: (raw: Mutable) => void, complete = false): ContentProblem[] => {
  const raw = validRaw();
  change(raw as unknown as Mutable);
  return checkContent(raw, { complete }).problems;
};

const firstLesson = (raw: Mutable) => {
  const [lesson] = raw.lessons;
  if (!lesson) throw new Error("fixture has no lesson");
  return lesson;
};

const firstQuestion = (raw: Mutable, index = 0) => {
  const question = firstLesson(raw).questions.data[index];
  if (!question) throw new Error("fixture has no question");
  return question;
};

describe("checkContent", () => {
  it("passes a valid course and returns the checked content", () => {
    const { problems, content } = checkContent(validRaw(), { complete: false });
    expect(problems).toEqual([]);
    expect(content?.lessons[0]?.blocks).toHaveLength(2);
    expect(content?.lessons[0]?.blocks[0]).toMatchObject({
      type: "text",
      body: { markdown: "Hello." },
      position: 1,
    });
    expect(content?.snippets[0]?.lines).toHaveLength(5);
  });

  it("returns no content when there is a problem", () => {
    const raw = validRaw();
    raw.units = null;
    const { problems, content } = checkContent(raw, { complete: false });
    expect(problems).toContainEqual({ file: "units.ts", message: "units.ts is missing" });
    expect(content).toBeNull();
  });

  it("names the file and field when a file doesn't match its schema", () => {
    const problems = problemsAfter((raw) => {
      delete firstLesson(raw).lesson.data.summary;
    });
    expect(problems).toContainEqual({
      file: lessonFile,
      message: expect.stringContaining("summary"),
    });
  });

  it("needs at least one objective", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).lesson.data.objectives = [];
    });
    expect(problems).toContainEqual({
      file: lessonFile,
      message: expect.stringContaining("at least one objective"),
    });
  });

  it("puts a tree from the frontmatter into the text block body", () => {
    const raw = validRaw();
    firstLesson(raw as unknown as Mutable).blocks[0] = {
      file: "01-intro/blocks/01-text.md",
      format: "markdown",
      text: "---\nposition: 1\ntranscript: Trace it.\ntree: [8, 4, 12]\n---\nTrace this tree.",
    };
    const { problems, content } = checkContent(raw, { complete: false });
    expect(problems).toEqual([]);
    expect(content?.lessons[0]?.blocks[0]).toMatchObject({
      type: "text",
      body: { markdown: "Trace this tree.", tree: [8, 4, 12] },
    });
  });

  it("puts labels and terms from the frontmatter into the text block body", () => {
    const raw = validRaw();
    firstLesson(raw as unknown as Mutable).blocks[0] = {
      file: "01-intro/blocks/01-text.md",
      format: "markdown",
      text: "---\nposition: 1\ntranscript: Root.\ntree: [8]\nlabels:\n  - text: [8 is the root]\n    keys: [8]\n    place: right\nterms:\n  root: [8]\n---\nThe **root**.",
    };
    const { problems, content } = checkContent(raw, { complete: false });
    expect(problems).toEqual([]);
    expect(content?.lessons[0]?.blocks[0]).toMatchObject({
      body: {
        labels: [{ text: ["8 is the root"], keys: [8], place: "right" }],
        terms: { root: [8] },
      },
    });
  });

  it("puts write and answer from the frontmatter into the text block body", () => {
    const raw = validRaw();
    firstLesson(raw as unknown as Mutable).blocks[0] = {
      file: "01-intro/blocks/01-text.md",
      format: "markdown",
      text: "---\nposition: 1\ntranscript: Write it.\nwrite: true\nanswer: |\n  1. `visit(8)`\n  2. `visit(4)`\n---\nWrite the visits.",
    };
    const { problems, content } = checkContent(raw, { complete: false });
    expect(problems).toEqual([]);
    expect(content?.lessons[0]?.blocks[0]).toMatchObject({
      body: {
        markdown: "Write the visits.",
        write: true,
        answer: "1. `visit(8)`\n2. `visit(4)`\n",
      },
    });
  });

  it("rejects a write that isn't true or false", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[0] = {
        file: "01-intro/blocks/01-text.md",
        format: "markdown",
        text: "---\nposition: 1\ntranscript: Write it.\nwrite: yes please\n---\nWrite it.",
      };
    });
    expect(problems).toContainEqual(
      expect.objectContaining({ file: "01-intro/blocks/01-text.md" }),
    );
  });

  it("lets a text term point at a diagram at the same position", () => {
    const raw = validRaw();
    firstLesson(raw as unknown as Mutable).blocks[0] = {
      file: "01-intro/blocks/01-text.md",
      format: "markdown",
      text: "---\nposition: 1\ntranscript: Root.\nterms:\n  root: [20]\n---\nThe **root**.",
    };
    expect(checkContent(raw, { complete: false }).problems).toEqual([]);
  });

  it("rejects a term whose keys no tree at its position shows", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[0] = {
        file: "01-intro/blocks/01-text.md",
        format: "markdown",
        text: "---\nposition: 1\ntranscript: Root.\nterms:\n  root: [8]\n---\nThe **root**.",
      };
    });
    expect(problems).toContainEqual({
      file: lessonFile,
      message: 'Block at position 1 links "root" to 8, but no tree at that position shows them',
    });
  });

  it("rejects a label pointing at a key that isn't in its tree", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[1] = {
        file: "01-intro/blocks/01-visual.ts",
        format: "module",
        data: {
          type: "diagram",
          position: 1,
          style: "visual",
          transcript: "A tree.",
          body: {
            startingKeys: [20],
            highlights: [],
            caption: "A tree.",
            labels: [{ text: ["The root"], keys: [7], place: "right" }],
          },
        },
      };
    });
    expect(problems).toContainEqual({
      file: lessonFile,
      message: 'Block at position 1 has a label "The root" pointing at 7, which isn\'t in its tree',
    });
  });

  it("rejects a text block tree with repeated keys", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[0] = {
        file: "01-intro/blocks/01-text.md",
        format: "markdown",
        text: "---\nposition: 1\ntranscript: Trace it.\ntree: [8, 4, 8]\n---\nTrace this tree.",
      };
    });
    expect(problems).toContainEqual({
      file: "01-intro/blocks/01-text.md",
      message: expect.stringContaining("Keys must not repeat"),
    });
  });

  it("rejects a markdown block with no frontmatter", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[0] = {
        file: "01-intro/blocks/01-text.md",
        format: "markdown",
        text: "Hi",
      };
    });
    expect(problems[0]).toEqual({
      file: "01-intro/blocks/01-text.md",
      message: expect.stringContaining("frontmatter"),
    });
  });

  it("rejects a block with no transcript", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks[0] = {
        file: "01-intro/blocks/01-text.md",
        format: "markdown",
        text: "---\nposition: 1\n---\nHello.",
      };
    });
    expect(problems).toContainEqual({
      file: "01-intro/blocks/01-text.md",
      message: expect.stringContaining("transcript"),
    });
  });

  it("rejects duplicate unit keys and gaps in unit positions", () => {
    const problems = problemsAfter((raw) => {
      raw.units.data.push({ key: "basics", position: 3, title: "Again" });
    });
    expect(problems).toContainEqual({
      file: "units.ts",
      message: 'More than one unit has the key "basics"',
    });
    expect(problems).toContainEqual({
      file: "units.ts",
      message: expect.stringContaining("Unit positions"),
    });
  });

  it("rejects a lesson in a unit that doesn't exist", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).lesson.data.unit = "missing";
    });
    expect(problems).toContainEqual({
      file: lessonFile,
      message: 'Unit "missing" doesn\'t exist in units.ts',
    });
  });

  it("rejects gaps in lesson positions", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).lesson.data.position = 2;
    });
    expect(problems).toEqual([{ file: "units.ts", message: expect.stringContaining("found 2") }]);
  });

  it("rejects gaps in block positions", () => {
    const problems = problemsAfter((raw) => {
      const visual = firstLesson(raw).blocks[1] as { data: Record<string, unknown> };
      visual.data.style = undefined;
      visual.data.position = 3;
    });
    expect(problems).toEqual([
      { file: lessonFile, message: expect.stringContaining("Block positions") },
    ]);
  });

  it("needs exactly one core block and one block per style at each position", () => {
    const problems = problemsAfter((raw) => {
      const lesson = firstLesson(raw);
      const visual = lesson.blocks[1] as { file: string; data: Record<string, unknown> };
      lesson.blocks.push({ ...visual, file: "01-intro/blocks/01-visual-again.ts" });
      visual.data = { ...visual.data };
      lesson.blocks.push({
        file: "01-intro/blocks/01-core-again.ts",
        format: "module",
        data: { ...visual.data, style: undefined },
      });
    });
    expect(problems).toEqual([
      { file: lessonFile, message: "Position 1 needs exactly one block with no style, found 2" },
      { file: lessonFile, message: "Position 1 has more than one visual block" },
    ]);
  });

  it("rejects a code trace for an unknown algorithm", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks.push({
        file: "01-intro/blocks/02-trace.ts",
        format: "module",
        data: {
          type: "code_trace",
          position: 2,
          transcript: "Trace.",
          body: {
            algorithmCode: "bubble-sort",
            startingKeys: [1],
            operation: { operation: "insert", key: 2 },
          },
        },
      });
    });
    expect(problems).toEqual([
      { file: lessonFile, message: expect.stringContaining('unknown algorithm "bubble-sort"') },
    ]);
  });

  it("rejects a traversal trace that isn't a traverse", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks.push({
        file: "01-intro/blocks/02-trace.ts",
        format: "module",
        data: {
          type: "code_trace",
          position: 2,
          transcript: "Trace.",
          body: {
            algorithmCode: "preorder",
            startingKeys: [1],
            operation: { operation: "search", key: 1 },
          },
        },
      });
    });
    expect(problems).toEqual([
      { file: lessonFile, message: expect.stringContaining('must be "traverse"') },
    ]);
  });

  it("rejects a traverse on an algorithm that isn't a traversal", () => {
    const problems = problemsAfter((raw) => {
      firstLesson(raw).blocks.push({
        file: "01-intro/blocks/02-trace.ts",
        format: "module",
        data: {
          type: "code_trace",
          position: 2,
          transcript: "Trace.",
          body: {
            algorithmCode: "insert",
            startingKeys: [1],
            operation: { operation: "traverse" },
          },
        },
      });
    });
    expect(problems).toEqual([
      { file: lessonFile, message: expect.stringContaining('can\'t be "traverse"') },
    ]);
  });

  it("needs a review lesson that exists", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw).reviewLesson = "nowhere";
    });
    expect(problems).toEqual([
      { file: questionsFile, message: expect.stringContaining('reviews lesson "nowhere"') },
    ]);
  });

  it("needs two hints", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw).hints = ["Only one."];
    });
    expect(problems).toEqual([
      { file: questionsFile, message: expect.stringContaining("at least two hints") },
    ]);
  });

  it("needs exactly one correct option", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw).options = [
        { key: "a", text: "20", isCorrect: true },
        { key: "b", text: "10", isCorrect: true },
      ];
    });
    expect(problems).toEqual([
      { file: questionsFile, message: 'Question "root" needs exactly one correct option, found 2' },
    ]);
  });

  it("rejects repeated option keys and question keys", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw).options = [
        { key: "a", text: "20", isCorrect: true },
        { key: "a", text: "10", isCorrect: false },
      ];
      firstLesson(raw).generated.data.push(generatedQuestion("root"));
    });
    expect(problems).toEqual([
      { file: lessonFile, message: 'More than one question in this lesson has the key "root"' },
      { file: questionsFile, message: 'Question "root" has more than one option with key "a"' },
    ]);
  });

  it("rejects a tree that doesn't decode", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw, 1).tree = "20,10";
    });
    expect(problems).toEqual([
      { file: questionsFile, message: expect.stringContaining('Question "order" tree') },
    ]);
  });

  it("rejects an answer of the wrong type", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw, 1).answer = { type: "text", text: "20" };
    });
    expect(problems).toEqual([
      {
        file: questionsFile,
        message: 'Question "order" is a order_nodes question, but its answer is a text answer',
      },
    ]);
  });

  it("rejects answer keys that aren't in the tree", () => {
    const problems = problemsAfter((raw) => {
      firstQuestion(raw, 1).answer = { type: "order_nodes", keys: [20, 99] };
    });
    expect(problems).toEqual([
      { file: questionsFile, message: expect.stringContaining("aren't in the tree: 99") },
    ]);
  });

  it("rejects a rotation pivot that isn't in the tree", () => {
    const problems = problemsAfter((raw) => {
      Object.assign(firstQuestion(raw, 1), {
        type: "predict_rotation",
        answer: { type: "predict_rotation", rotation: "left", pivotKey: 99 },
      });
    });
    expect(problems).toEqual([
      { file: questionsFile, message: expect.stringContaining("pivots on 99") },
    ]);
  });

  it("rejects an unknown generator key", () => {
    const problems = problemsAfter((raw) => {
      Object.assign(firstLesson(raw).generated.data[0] ?? {}, { generatorKey: "guess" });
    });
    expect(problems).toEqual([
      { file: generatedFile, message: expect.stringContaining("0.generatorKey") },
    ]);
  });

  it("names missing and unknown step markers in a snippet", () => {
    const problems = problemsAfter((raw) => {
      const [snippet] = raw.snippets;
      if (snippet) snippet.text = "visit // @step preorder.visit preorder.jump";
    });
    expect(problems).toEqual([
      {
        file: "snippets/preorder/java.java",
        message:
          "No @step marker for: preorder.check-empty, preorder.empty, preorder.go-left, preorder.go-right",
      },
      {
        file: "snippets/preorder/java.java",
        message: "Markers for steps preorder never emits: preorder.jump",
      },
    ]);
  });

  it("rejects a snippet for an unknown algorithm or language", () => {
    const problems = problemsAfter((raw) => {
      raw.snippets.push(
        { file: "snippets/sort/java.java", algorithm: "sort", language: "java", text: "" },
        {
          file: "snippets/preorder/python.py",
          algorithm: "preorder",
          language: "python",
          text: "",
        },
      );
    });
    expect(problems).toEqual([
      {
        file: "snippets/sort/java.java",
        message: expect.stringContaining('Unknown algorithm "sort"'),
      },
      {
        file: "snippets/preorder/python.py",
        message: expect.stringContaining('Unknown language "python"'),
      },
    ]);
  });

  it("rejects a step marked twice", () => {
    const problems = problemsAfter((raw) => {
      const [snippet] = raw.snippets;
      if (snippet) snippet.text = `${preorderSnippet}\nagain // @step preorder.visit`;
    });
    expect(problems).toEqual([
      {
        file: "snippets/preorder/java.java",
        message: 'Step "preorder.visit" is marked more than once',
      },
    ]);
  });

  it("rejects a case study for a lesson that doesn't exist", () => {
    const problems = problemsAfter((raw) => {
      const [caseStudy] = raw.caseStudies;
      if (caseStudy) caseStudy.data.lesson = "nowhere";
    });
    expect(problems).toEqual([
      { file: "case-studies/garden.ts", message: 'Lesson "nowhere" doesn\'t exist' },
    ]);
  });

  it("rejects files in a folder with no lesson.ts", () => {
    const problems = problemsAfter((raw) => {
      raw.strayFiles.push("02-draft/questions.ts");
    });
    expect(problems).toEqual([
      { file: "02-draft/questions.ts", message: expect.stringContaining("no lesson.ts") },
    ]);
  });

  it("reports files the loader doesn't read", () => {
    const problems = problemsAfter((raw) => {
      raw.unknownFiles.push("01-intro/blocks/03-extra.mdx");
    });
    expect(problems).toEqual([
      {
        file: "01-intro/blocks/03-extra.mdx",
        message: expect.stringContaining("The loader doesn't read this file"),
      },
    ]);
  });

  it("reports every file that couldn't be loaded", () => {
    const problems = problemsAfter((raw) => {
      raw.unreadableFiles.push(
        { file: "case-studies/broken.ts", reason: "Unexpected token" },
        { file: "02-other/lesson.ts", reason: "Expected }" },
      );
    });
    expect(problems).toEqual([
      { file: "case-studies/broken.ts", message: "Could not be loaded: Unexpected token" },
      { file: "02-other/lesson.ts", message: "Could not be loaded: Expected }" },
    ]);
  });

  it("rejects an @step marker with no step key", () => {
    const problems = problemsAfter((raw) => {
      const [snippet] = raw.snippets;
      if (snippet) snippet.text = `${preorderSnippet}\nnothing // @step`;
    });
    expect(problems).toEqual([
      {
        file: "snippets/preorder/java.java",
        message: "Line 6 has an @step marker with no step key",
      },
    ]);
  });

  it(`needs ${minimumGeneratedQuestions} generated questions only when the course is complete`, () => {
    expect(problemsAfter(() => {}, false)).toEqual([]);
    expect(problemsAfter(() => {}, true)).toEqual([
      {
        file: "content",
        message: `The course needs at least ${minimumGeneratedQuestions} generated questions, found 1`,
      },
    ]);
    const enough = problemsAfter((raw) => {
      firstLesson(raw).generated.data = Array.from(
        { length: minimumGeneratedQuestions },
        (_, index) => generatedQuestion(`generated-${index + 1}`),
      );
    }, true);
    expect(enough).toEqual([]);
  });
});
