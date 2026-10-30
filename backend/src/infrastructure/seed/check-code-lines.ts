import type { Logger } from "@/application/logging/logger";
import { findCodeLineGaps } from "@/domain/course-content/code-trace";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import type { CodeLineRepository } from "@/domain/course-content/repositories/code-line-repository";
import type { CodeSnippetRepository } from "@/domain/course-content/repositories/code-snippet-repository";

export type CodeLineCheckDependencies = {
  algorithmRepository: Pick<AlgorithmRepository, "listAll">;
  codeLanguageRepository: Pick<CodeLanguageRepository, "findById">;
  codeSnippetRepository: Pick<CodeSnippetRepository, "listByAlgorithmId">;
  codeLineRepository: Pick<CodeLineRepository, "listByCodeSnippetId">;
};

export type SnippetGaps = {
  algorithm: string;
  language: string;
  missing: string[];
  unknown: string[];
};

export type CodeLineCheck = {
  snippetsChecked: number;
  gaps: SnippetGaps[];
};

export async function checkCodeLines({
  algorithmRepository,
  codeLanguageRepository,
  codeSnippetRepository,
  codeLineRepository,
}: CodeLineCheckDependencies): Promise<CodeLineCheck> {
  const gaps: SnippetGaps[] = [];
  let snippetsChecked = 0;

  for (const algorithm of await algorithmRepository.listAll()) {
    for (const snippet of await codeSnippetRepository.listByAlgorithmId(algorithm.id)) {
      snippetsChecked += 1;
      const codeLines = await codeLineRepository.listByCodeSnippetId(snippet.id);
      const { missing, unknown } = findCodeLineGaps(algorithm.code, codeLines);
      if (missing.length === 0 && unknown.length === 0) continue;
      const language = await codeLanguageRepository.findById(snippet.codeLanguageId);
      gaps.push({
        algorithm: algorithm.code,
        language: language?.code ?? snippet.codeLanguageId,
        missing,
        unknown,
      });
    }
  }

  return { snippetsChecked, gaps };
}

export function describeMissingCodeLines(gaps: SnippetGaps[]): string | null {
  const incomplete = gaps.filter((gap) => gap.missing.length > 0);
  if (incomplete.length === 0) return null;
  return [
    "Some code snippets have no line for a step the engine can emit:",
    ...incomplete.map((gap) => `${gap.algorithm} (${gap.language}): ${gap.missing.join(", ")}`),
  ].join("\n");
}

export async function verifyCodeLines(
  dependencies: CodeLineCheckDependencies,
  logger: Logger,
): Promise<void> {
  const { snippetsChecked, gaps } = await checkCodeLines(dependencies);

  for (const gap of gaps.filter((item) => item.unknown.length > 0)) {
    logger.warn("Code snippet has lines for steps the engine never emits", {
      algorithm: gap.algorithm,
      language: gap.language,
      unknown: gap.unknown,
    });
  }

  const missing = describeMissingCodeLines(gaps);
  if (missing) throw new Error(missing);

  if (snippetsChecked === 0) {
    logger.info("No code snippets to check yet");
    return;
  }
  logger.info("Every code snippet has a line for every step", { snippetsChecked });
}
