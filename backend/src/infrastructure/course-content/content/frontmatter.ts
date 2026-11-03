export class FrontmatterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FrontmatterError";
  }
}

export type Frontmatter = {
  data: unknown;
  body: string;
};

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/;

export const parseFrontmatter = (text: string): Frontmatter => {
  const match = frontmatterPattern.exec(text);
  if (!match) {
    throw new FrontmatterError("Start the file with YAML frontmatter between two --- lines");
  }
  try {
    return { data: Bun.YAML.parse(match[1] ?? ""), body: (match[2] ?? "").trim() };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new FrontmatterError(`The frontmatter is not valid YAML: ${reason}`);
  }
};
