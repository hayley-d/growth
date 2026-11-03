export type SnippetLine = {
  stepKey: string;
  lineNumber: number;
};

export type ParsedSnippet = {
  source: string;
  lines: SnippetLine[];
  duplicates: string[];
};

const markerPattern = /\s*\/\/ @step\s+(\S.*?)\s*$/;

export const parseSnippet = (text: string): ParsedSnippet => {
  const lines: SnippetLine[] = [];
  const duplicates = new Set<string>();
  const seen = new Set<string>();

  const sourceLines = text.split(/\r?\n/).map((line, index) => {
    const match = markerPattern.exec(line);
    if (!match) return line;
    for (const stepKey of (match[1] ?? "").split(/\s+/)) {
      if (seen.has(stepKey)) {
        duplicates.add(stepKey);
        continue;
      }
      seen.add(stepKey);
      lines.push({ stepKey, lineNumber: index + 1 });
    }
    return line.slice(0, match.index);
  });

  return { source: sourceLines.join("\n"), lines, duplicates: [...duplicates] };
};
