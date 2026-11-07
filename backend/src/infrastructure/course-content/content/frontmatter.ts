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

const frontmatterPattern = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n([\s\S]*))?$/;

const byteOrderMark = "﻿";

export const parseFrontmatter = (text: string): Frontmatter => {
  const match = frontmatterPattern.exec(
    text.startsWith(byteOrderMark) ? text.slice(byteOrderMark.length) : text,
  );
  if (!match) {
    throw new FrontmatterError("Start the file with YAML frontmatter between two --- lines");
  }
  const yaml = match[1] ?? "";
  if (yaml.trim() === "") throw new FrontmatterError("The frontmatter is empty");
  try {
    return { data: Bun.YAML.parse(yaml), body: (match[2] ?? "").trim() };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new FrontmatterError(`The frontmatter is not valid YAML: ${reason}`);
  }
};
