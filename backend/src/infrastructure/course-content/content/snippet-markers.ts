export type SnippetLine = {
  stepKey: string;
  lineNumber: number;
};

export type ParsedSnippet = {
  source: string;
  lines: SnippetLine[];
  duplicates: string[];
  emptyMarkers: number[];
};

const markerPattern = /\s*\/\/\s*@step\b(.*)$/;

export const parseSnippet = (text: string): ParsedSnippet => {
  const lines: SnippetLine[] = [];
  const duplicates = new Set<string>();
  const emptyMarkers: number[] = [];
  const seen = new Set<string>();

  const sourceLines = text.split(/\r?\n/).map((line, index) => {
    const match = markerPattern.exec(line);
    if (!match) return line;
    const lineNumber = index + 1;
    const stepKeys = (match[1] ?? "").trim().split(/\s+/).filter(Boolean);
    if (stepKeys.length === 0) emptyMarkers.push(lineNumber);
    for (const stepKey of stepKeys) {
      if (seen.has(stepKey)) {
        duplicates.add(stepKey);
        continue;
      }
      seen.add(stepKey);
      lines.push({ stepKey, lineNumber });
    }
    return line.slice(0, match.index);
  });

  return { source: sourceLines.join("\n"), lines, duplicates: [...duplicates], emptyMarkers };
};
