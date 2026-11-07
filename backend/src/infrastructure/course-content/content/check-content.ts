import type { z } from "zod";

import {
  type AlgorithmCode,
  algorithmCodes,
  decodeTree,
  isAlgorithmCode,
  TreeEncodingError,
  toKeys,
} from "@shared/avl";
import { findCodeLineGaps } from "@/domain/course-content/code-trace";
import { BadRequestError } from "@/domain/errors";
import {
  type BlockData,
  blockContentSchema,
  type CaseStudyData,
  caseStudyContentSchema,
  type GeneratedQuestionData,
  generatedQuestionsContentSchema,
  type LessonData,
  lessonContentSchema,
  type UnitData,
  unitsContentSchema,
  type WrittenQuestionData,
  writtenQuestionsContentSchema,
} from "@/infrastructure/course-content/content/content-schema";
import {
  FrontmatterError,
  parseFrontmatter,
} from "@/infrastructure/course-content/content/frontmatter";
import { groupBy } from "@/infrastructure/course-content/content/group-by";
import type {
  BlockFile,
  ContentModule,
  LessonFolder,
  RawContent,
} from "@/infrastructure/course-content/content/read-content";
import {
  parseSnippet,
  type SnippetLine,
} from "@/infrastructure/course-content/content/snippet-markers";
import { codeLanguages } from "@/infrastructure/seed/reference-data";

export const minimumGeneratedQuestions = 14;

export type ContentProblem = {
  file: string;
  message: string;
};

export const describeProblems = (problems: readonly ContentProblem[]) =>
  [
    `The content has ${problems.length} problem${problems.length === 1 ? "" : "s"}:`,
    ...problems.map((problem) => `  ${problem.file}: ${problem.message}`),
  ].join("\n");

export class ContentProblemsError extends BadRequestError {
  readonly problems: ContentProblem[];

  constructor(problems: ContentProblem[]) {
    super(describeProblems(problems), { problems });
    this.name = "ContentProblemsError";
    this.problems = problems;
  }
}

export type CheckedLesson = {
  file: string;
  data: LessonData;
  blocks: BlockData[];
  questions: WrittenQuestionData[];
  generated: GeneratedQuestionData[];
};

export type CheckedSnippet = {
  file: string;
  algorithm: AlgorithmCode;
  language: string;
  source: string;
  lines: SnippetLine[];
};

export type CheckedCaseStudy = {
  file: string;
  data: CaseStudyData;
};

export type CheckedContent = {
  units: UnitData[];
  lessons: CheckedLesson[];
  snippets: CheckedSnippet[];
  caseStudies: CheckedCaseStudy[];
};

export type ContentCheck = {
  problems: ContentProblem[];
  content: CheckedContent | null;
};

export type ContentCheckOptions = {
  complete: boolean;
};

type Report = (file: string, message: string) => void;

const unitsFile = "units.ts";

const findDuplicates = (values: readonly string[]) => [
  ...new Set(values.filter((value, index) => values.indexOf(value) !== index)),
];

const parseWith = <Schema extends z.ZodType>(
  schema: Schema,
  file: string,
  data: unknown,
  report: Report,
): z.output<Schema> | null => {
  const parsed = schema.safeParse(data);
  if (parsed.success) return parsed.data;
  for (const issue of parsed.error.issues) {
    const path = issue.path.join(".");
    report(file, path ? `${path}: ${issue.message}` : issue.message);
  }
  return null;
};

const parseOptionalList = <Schema extends z.ZodType<unknown[]>>(
  schema: Schema,
  module: ContentModule | null,
  report: Report,
): z.output<Schema> | [] =>
  module ? (parseWith(schema, module.file, module.data, report) ?? []) : [];

const checkSequence = (
  positions: readonly number[],
  file: string,
  label: string,
  report: Report,
) => {
  const sorted = [...positions].sort((first, second) => first - second);
  if (sorted.every((position, index) => position === index + 1)) return;
  report(
    file,
    `${label} must be numbered 1 to ${sorted.length} with no gaps or repeats, found ${sorted.join(", ")}`,
  );
};

const readTreeKeys = (tree: string, file: string, label: string, report: Report) => {
  try {
    return toKeys(decodeTree(tree));
  } catch (error) {
    if (!(error instanceof TreeEncodingError)) throw error;
    report(file, `${label}: ${error.message}`);
    return null;
  }
};

const parseBlock = (block: BlockFile, report: Report): BlockData | null => {
  if (block.format === "module") {
    return parseWith(blockContentSchema, block.file, block.data, report);
  }
  try {
    const { data, body } = parseFrontmatter(block.text);
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      report(block.file, "The frontmatter must hold position, transcript and an optional style");
      return null;
    }
    return parseWith(
      blockContentSchema,
      block.file,
      { ...data, type: "text", body: { markdown: body } },
      report,
    );
  } catch (error) {
    if (!(error instanceof FrontmatterError)) throw error;
    report(block.file, error.message);
    return null;
  }
};

const checkBlocks = (lessonFile: string, blocks: BlockData[], report: Report) => {
  const positions = [...new Set(blocks.map((block) => block.position))];
  checkSequence(positions, lessonFile, "Block positions", report);
  for (const position of positions) {
    const atPosition = blocks.filter((block) => block.position === position);
    const coreCount = atPosition.filter((block) => block.style === undefined).length;
    if (coreCount !== 1) {
      report(
        lessonFile,
        `Position ${position} needs exactly one block with no style, found ${coreCount}`,
      );
    }
    for (const style of findDuplicates(atPosition.flatMap((block) => block.style ?? []))) {
      report(lessonFile, `Position ${position} has more than one ${style} block`);
    }
  }
  for (const block of blocks) {
    if (block.type === "code_trace" && !isAlgorithmCode(block.body.algorithmCode)) {
      report(
        lessonFile,
        `Block at position ${block.position} uses unknown algorithm "${block.body.algorithmCode}". Use one of ${algorithmCodes.join(", ")}`,
      );
    }
  }
};

const checkReviewLesson = (
  file: string,
  question: { key: string; reviewLesson: string },
  lessonKeys: ReadonlySet<string>,
  report: Report,
) => {
  if (!lessonKeys.has(question.reviewLesson)) {
    report(
      file,
      `Question "${question.key}" reviews lesson "${question.reviewLesson}", which doesn't exist`,
    );
  }
};

const checkWrittenQuestion = (
  file: string,
  question: WrittenQuestionData,
  lessonKeys: ReadonlySet<string>,
  report: Report,
) => {
  const label = `Question "${question.key}"`;
  checkReviewLesson(file, question, lessonKeys, report);
  const treeKeys =
    question.tree === undefined ? null : readTreeKeys(question.tree, file, `${label} tree`, report);

  if (question.type === "multiple_choice") {
    for (const key of findDuplicates(question.options.map((option) => option.key))) {
      report(file, `${label} has more than one option with key "${key}"`);
    }
    const correctCount = question.options.filter((option) => option.isCorrect).length;
    if (correctCount !== 1) {
      report(file, `${label} needs exactly one correct option, found ${correctCount}`);
    }
    return;
  }
  if (question.type === "text") {
    for (const key of findDuplicates(question.accepted.map((option) => option.key))) {
      report(file, `${label} has more than one accepted answer with key "${key}"`);
    }
    return;
  }

  const { answer } = question;
  if (answer.type !== question.type) {
    report(
      file,
      `${label} is a ${question.type} question, but its answer is a ${answer.type} answer`,
    );
    return;
  }
  if (answer.type === "build_tree") {
    readTreeKeys(answer.tree, file, `${label} answer`, report);
  }
  if (answer.type === "order_nodes" && treeKeys) {
    const missing = answer.keys.filter((key) => !treeKeys.includes(key));
    if (missing.length > 0) {
      report(file, `${label} answer uses keys that aren't in the tree: ${missing.join(", ")}`);
    }
  }
  if (answer.type === "predict_rotation" && treeKeys && answer.pivotKey !== null) {
    if (!treeKeys.includes(answer.pivotKey)) {
      report(file, `${label} answer pivots on ${answer.pivotKey}, which isn't in the tree`);
    }
  }
};

export const checkContent = (raw: RawContent, { complete }: ContentCheckOptions): ContentCheck => {
  const problems: ContentProblem[] = [];
  const report: Report = (file, message) => {
    problems.push({ file, message });
  };

  for (const { file, reason } of raw.unreadableFiles) {
    report(file, `Could not be loaded: ${reason}`);
  }

  const units = parseOptionalList(unitsContentSchema, raw.units, report);
  if (!raw.units) report(unitsFile, "units.ts is missing");
  const unitFile = raw.units?.file ?? unitsFile;
  for (const key of findDuplicates(units.map((unit) => unit.key))) {
    report(unitFile, `More than one unit has the key "${key}"`);
  }
  checkSequence(
    units.map((unit) => unit.position),
    unitFile,
    "Unit positions",
    report,
  );

  const checkedFolders: { folder: LessonFolder; lesson: CheckedLesson }[] = [];
  for (const folder of raw.lessons) {
    const data = parseWith(lessonContentSchema, folder.lesson.file, folder.lesson.data, report);
    const blocks = folder.blocks.flatMap((block) => parseBlock(block, report) ?? []);
    const questions = parseOptionalList(writtenQuestionsContentSchema, folder.questions, report);
    const generated = parseOptionalList(generatedQuestionsContentSchema, folder.generated, report);
    if (data) {
      checkBlocks(folder.lesson.file, blocks, report);
      checkedFolders.push({
        folder,
        lesson: { file: folder.lesson.file, data, blocks, questions, generated },
      });
    }
  }
  const lessons = checkedFolders.map(({ lesson }) => lesson);

  const unitKeys = new Set(units.map((unit) => unit.key));
  const lessonKeys = new Set(lessons.map((lesson) => lesson.data.key));
  for (const key of findDuplicates(lessons.map((lesson) => lesson.data.key))) {
    for (const lesson of lessons.filter((candidate) => candidate.data.key === key)) {
      report(lesson.file, `More than one lesson has the key "${key}"`);
    }
  }
  for (const lesson of lessons) {
    if (!unitKeys.has(lesson.data.unit)) {
      report(lesson.file, `Unit "${lesson.data.unit}" doesn't exist in units.ts`);
    }
  }
  for (const unit of units) {
    checkSequence(
      lessons
        .filter((lesson) => lesson.data.unit === unit.key)
        .map((lesson) => lesson.data.position),
      unitFile,
      `Lesson positions in unit "${unit.key}"`,
      report,
    );
  }

  for (const { folder, lesson } of checkedFolders) {
    const questionKeys = [
      ...lesson.questions.map((question) => question.key),
      ...lesson.generated.map((question) => question.key),
    ];
    for (const key of findDuplicates(questionKeys)) {
      report(lesson.file, `More than one question in this lesson has the key "${key}"`);
    }
    const questionsFile = folder.questions?.file ?? lesson.file;
    for (const question of lesson.questions) {
      checkWrittenQuestion(questionsFile, question, lessonKeys, report);
    }
    const generatedFile = folder.generated?.file ?? lesson.file;
    for (const question of lesson.generated) {
      checkReviewLesson(generatedFile, question, lessonKeys, report);
    }
  }

  const languageCodes = codeLanguages.map((language) => language.code);
  const snippets: CheckedSnippet[] = [];
  for (const key of findDuplicates(
    raw.snippets.map((snippet) => `${snippet.algorithm}/${snippet.language}`),
  )) {
    report(`snippets/${key}`, "More than one file has this algorithm and language");
  }
  for (const snippet of raw.snippets) {
    const { algorithm } = snippet;
    if (!isAlgorithmCode(algorithm)) {
      report(
        snippet.file,
        `Unknown algorithm "${algorithm}". Use one of ${algorithmCodes.join(", ")}`,
      );
      continue;
    }
    if (!languageCodes.includes(snippet.language)) {
      report(
        snippet.file,
        `Unknown language "${snippet.language}". Name the file after one of ${languageCodes.join(", ")}`,
      );
      continue;
    }
    const parsed = parseSnippet(snippet.text);
    for (const stepKey of parsed.duplicates) {
      report(snippet.file, `Step "${stepKey}" is marked more than once`);
    }
    for (const lineNumber of parsed.emptyMarkers) {
      report(snippet.file, `Line ${lineNumber} has an @step marker with no step key`);
    }
    const { missing, unknown } = findCodeLineGaps(algorithm, parsed.lines);
    if (missing.length > 0) {
      report(snippet.file, `No @step marker for: ${missing.join(", ")}`);
    }
    if (unknown.length > 0) {
      report(snippet.file, `Markers for steps ${algorithm} never emits: ${unknown.join(", ")}`);
    }
    snippets.push({
      file: snippet.file,
      algorithm,
      language: snippet.language,
      source: parsed.source,
      lines: parsed.lines,
    });
  }

  const caseStudies = raw.caseStudies.flatMap((caseStudy) => {
    const data = parseWith(caseStudyContentSchema, caseStudy.file, caseStudy.data, report);
    return data ? [{ file: caseStudy.file, data }] : [];
  });
  for (const key of findDuplicates(caseStudies.map((caseStudy) => caseStudy.data.key))) {
    report("case-studies", `More than one case study has the key "${key}"`);
  }
  for (const caseStudy of caseStudies) {
    if (!lessonKeys.has(caseStudy.data.lesson)) {
      report(caseStudy.file, `Lesson "${caseStudy.data.lesson}" doesn't exist`);
    }
  }
  for (const [key, group] of groupBy(caseStudies, (caseStudy) => caseStudy.data.lesson)) {
    checkSequence(
      group.map((caseStudy) => caseStudy.data.position),
      "case-studies",
      `Case study positions in lesson "${key}"`,
      report,
    );
  }

  for (const file of raw.strayFiles) {
    report(file, "This folder has no lesson.ts, so the file would never be loaded");
  }
  for (const file of raw.unknownFiles) {
    report(
      file,
      "The loader doesn't read this file. Use lesson.ts, questions.ts, generated.ts or blocks/<name>.md or .ts",
    );
  }

  if (complete) {
    const generatedCount = lessons.reduce((total, lesson) => total + lesson.generated.length, 0);
    if (generatedCount < minimumGeneratedQuestions) {
      report(
        "content",
        `The course needs at least ${minimumGeneratedQuestions} generated questions, found ${generatedCount}`,
      );
    }
  }

  return {
    problems,
    content: problems.length === 0 ? { units, lessons, snippets, caseStudies } : null,
  };
};
