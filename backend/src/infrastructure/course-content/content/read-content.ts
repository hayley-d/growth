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

export type UnreadableFile = {
  file: string;
  reason: string;
};

export type RawContent = {
  units: ContentModule | null;
  lessons: LessonFolder[];
  snippets: SnippetFile[];
  caseStudies: ContentModule[];
  strayFiles: string[];
  unknownFiles: string[];
  unreadableFiles: UnreadableFile[];
};

const lessonFolderFiles = ["lesson.ts", "questions.ts", "generated.ts"];

const blockFilePattern = /^blocks\/[^/]+\.(md|ts)$/;

const toPosix = (file: string) => file.replaceAll("\\", "/");

const scan = async (root: string, pattern: string) =>
  (await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: root, followSymlinks: true })))
    .map(toPosix)
    .sort();

const isKnownLessonFile = (folder: string, file: string) => {
  const inside = file.slice(folder.length + 1);
  return lessonFolderFiles.includes(inside) || blockFilePattern.test(inside);
};

export const readContent = async (root: string): Promise<RawContent> => {
  const unreadableFiles: UnreadableFile[] = [];

  const importModule = async (file: string): Promise<ContentModule | null> => {
    try {
      const loaded = (await import(join(root, file))) as { default?: unknown };
      return { file, data: loaded.default };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      unreadableFiles.push({ file, reason });
      return null;
    }
  };

  const importOptional = async (file: string | undefined) => (file ? importModule(file) : null);

  const readText = (file: string) => Bun.file(join(root, file)).text();

  const readBlock = async (file: string): Promise<BlockFile | null> => {
    if (extname(file) === ".md") return { file, format: "markdown", text: await readText(file) };
    const loaded = await importModule(file);
    return loaded ? { format: "module", ...loaded } : null;
  };

  const readLessonFolder = async (lessonFile: string): Promise<LessonFolder | null> => {
    const folder = dirname(lessonFile);
    const [lesson, blocks, questions, generated] = await Promise.all([
      importModule(lessonFile),
      scan(root, `${folder}/blocks/*.{md,ts}`).then((files) => Promise.all(files.map(readBlock))),
      scan(root, `${folder}/questions.ts`).then(([file]) => importOptional(file)),
      scan(root, `${folder}/generated.ts`).then(([file]) => importOptional(file)),
    ]);
    if (!lesson) return null;
    return {
      folder,
      lesson,
      blocks: blocks.flatMap((block) => block ?? []),
      questions,
      generated,
    };
  };

  const readSnippet = async (file: string): Promise<SnippetFile> => ({
    file,
    algorithm: basename(dirname(file)),
    language: basename(file, extname(file)),
    text: await readText(file),
  });

  const lessonFiles = await scan(root, "*/lesson.ts");
  const lessonFolders = lessonFiles.map((file) => dirname(file));
  const [units, lessons, snippets, caseStudies, folderFiles, lessonFolderContents] =
    await Promise.all([
      scan(root, "units.ts").then(([file]) => importOptional(file)),
      Promise.all(lessonFiles.map(readLessonFolder)),
      scan(root, "snippets/*/*").then((files) => Promise.all(files.map(readSnippet))),
      scan(root, "case-studies/*.ts").then((files) => Promise.all(files.map(importModule))),
      scan(root, "*/{blocks/*,questions.ts,generated.ts}"),
      Promise.all(
        lessonFolders.map(async (folder) =>
          (await scan(root, `${folder}/**/*`)).filter((file) => !isKnownLessonFile(folder, file)),
        ),
      ),
    ]);

  return {
    units,
    lessons: lessons.flatMap((lesson) => lesson ?? []),
    snippets,
    caseStudies: caseStudies.flatMap((caseStudy) => caseStudy ?? []),
    strayFiles: folderFiles.filter((file) => !lessonFolders.includes(file.split("/")[0] ?? "")),
    unknownFiles: lessonFolderContents.flat(),
    unreadableFiles: unreadableFiles.sort((first, second) => first.file.localeCompare(second.file)),
  };
};
