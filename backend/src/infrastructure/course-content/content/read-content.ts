import { basename, dirname, extname, join } from "node:path";

export type ContentModule = {
  file: string;
  data: unknown;
};

export type BlockFile =
  | { file: string; format: "module"; data: unknown }
  | { file: string; format: "markdown"; text: string };

export type LessonFolder = {
  folder: string;
  lesson: ContentModule;
  blocks: BlockFile[];
  questions: ContentModule | null;
  generated: ContentModule | null;
};

export type SnippetFile = {
  file: string;
  algorithm: string;
  language: string;
  text: string;
};

export type RawContent = {
  units: ContentModule | null;
  lessons: LessonFolder[];
  snippets: SnippetFile[];
  caseStudies: ContentModule[];
  strayFiles: string[];
};

const scan = async (root: string, pattern: string) =>
  (await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: root }))).sort();

const importModule = async (root: string, file: string): Promise<ContentModule> => {
  try {
    const loaded = (await import(join(root, file))) as { default?: unknown };
    return { file, data: loaded.default };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${file}: could not be loaded: ${reason}`);
  }
};

const readText = (root: string, file: string) => Bun.file(join(root, file)).text();

const readBlock = async (root: string, file: string): Promise<BlockFile> =>
  extname(file) === ".md"
    ? { file, format: "markdown", text: await readText(root, file) }
    : { format: "module", ...(await importModule(root, file)) };

const readLessonFolder = async (root: string, lessonFile: string): Promise<LessonFolder> => {
  const folder = dirname(lessonFile);
  const blockFiles = await scan(root, `${folder}/blocks/*.{md,ts}`);
  const [questionFile] = await scan(root, `${folder}/questions.ts`);
  const [generatedFile] = await scan(root, `${folder}/generated.ts`);
  return {
    folder,
    lesson: await importModule(root, lessonFile),
    blocks: await Promise.all(blockFiles.map((file) => readBlock(root, file))),
    questions: questionFile ? await importModule(root, questionFile) : null,
    generated: generatedFile ? await importModule(root, generatedFile) : null,
  };
};

const readSnippet = async (root: string, file: string): Promise<SnippetFile> => ({
  file,
  algorithm: basename(dirname(file)),
  language: basename(file, extname(file)),
  text: await readText(root, file),
});

export const readContent = async (root: string): Promise<RawContent> => {
  const [unitsFile] = await scan(root, "units.ts");
  const lessonFiles = await scan(root, "*/lesson.ts");
  const lessonFolders = new Set(lessonFiles.map((file) => dirname(file)));
  const folderFiles = await scan(root, "*/{blocks/*,questions.ts,generated.ts}");

  return {
    units: unitsFile ? await importModule(root, unitsFile) : null,
    lessons: await Promise.all(lessonFiles.map((file) => readLessonFolder(root, file))),
    snippets: await Promise.all(
      (await scan(root, "snippets/*/*")).map((file) => readSnippet(root, file)),
    ),
    caseStudies: await Promise.all(
      (await scan(root, "case-studies/*.ts")).map((file) => importModule(root, file)),
    ),
    strayFiles: folderFiles.filter((file) => !lessonFolders.has(file.split("/")[0] ?? "")),
  };
};
