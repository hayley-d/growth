import type { TreeLabel } from "@shared/schemas";

export type LabelPoint = { cx: number; cy: number };

export type PlacedLabel = {
  label: TreeLabel;
  leaders: string[];
  bracket: string | null;
  dot: { x: number; y: number } | null;
  text: { x: number; y: number; anchor: "start" | "middle" };
};

export type LabelLayout = {
  width: number;
  height: number;
  placed: PlacedLabel[];
};

export const labelLineHeight = 18;
export const labelCharWidth = 7.4;

const textWidth = (label: TreeLabel) =>
  Math.max(...label.text.map((line) => line.length)) * labelCharWidth;

export const layoutTreeLabels = (
  labels: readonly TreeLabel[],
  points: ReadonlyMap<number, LabelPoint>,
  base: { width: number; height: number },
  radius: number,
): LabelLayout => {
  const usable = labels.filter((label) => label.keys.every((key) => points.has(key)));
  const at = (key: number) => points.get(key) ?? { cx: 0, cy: 0 };
  const beside = usable.filter((label) => label.place !== "below");
  const below = usable.filter((label) => label.place === "below");
  const sidePad = beside.length > 0 ? Math.max(...beside.map(textWidth)) + 34 : 0;
  const belowLines = Math.max(0, ...below.map((label) => label.text.length));
  const bottomPad = below.length > 0 ? 44 + belowLines * labelLineHeight : 0;
  const width = base.width + sidePad;
  const height = base.height + bottomPad;
  const edge = base.width;

  const placed = usable.map((label): PlacedLabel => {
    if (label.place === "right") {
      const { cx, cy } = at(label.keys[0] ?? 0);
      const start = cx + radius + 6;
      return {
        label,
        leaders: [`M ${start} ${cy} H ${edge + 8}`],
        bracket: null,
        dot: { x: start, y: cy },
        text: { x: edge + 16, y: cy + 5, anchor: "start" },
      };
    }
    if (label.place === "side") {
      const ys = label.keys.map((key) => at(key).cy);
      const top = Math.min(...ys) - radius;
      const bottom = Math.max(...ys) + radius;
      const bracketX = edge + 4;
      const middle = (top + bottom) / 2 - ((label.text.length - 1) * labelLineHeight) / 2 + 5;
      return {
        label,
        leaders: label.keys.map((key) => {
          const { cx, cy } = at(key);
          return `M ${cx + radius + 6} ${cy} H ${bracketX - 6}`;
        }),
        bracket: `M ${bracketX - 6} ${top} H ${bracketX} V ${bottom} H ${bracketX - 6}`,
        dot: null,
        text: { x: bracketX + 14, y: middle, anchor: "start" },
      };
    }
    const xs = label.keys.map((key) => at(key).cx);
    const ys = label.keys.map((key) => at(key).cy);
    const left = Math.min(...xs) - radius;
    const right = Math.max(...xs) + radius;
    const line = Math.max(...ys) + radius + 14;
    const middle = (left + right) / 2;
    const half = textWidth(label) / 2;
    return {
      label,
      leaders: [`M ${middle} ${line} V ${line + 16}`],
      bracket: `M ${left} ${line - 6} V ${line} H ${right} V ${line - 6}`,
      dot: null,
      text: {
        x: Math.min(Math.max(middle, half + 4), width - half - 4),
        y: line + 34,
        anchor: "middle",
      },
    };
  });

  return { width, height, placed };
};

export const describeLabelledTree = (parts: readonly string[], labels: readonly TreeLabel[] = []) =>
  [...parts, ...labels.map((label) => label.text.join(" "))]
    .map((part) => part.trim().replace(/\.+$/, ""))
    .filter((part) => part.length > 0)
    .join(". ")
    .concat(".");

export const labelLetterMs = 28;
export const labelLineGapMs = 120;
export const labelTextDelayMs = 380;
export const labelGapMs = 150;

export type LabelTiming = { start: number; lines: number[] };

export const labelTimeline = (labels: readonly TreeLabel[], begin = 0) => {
  let cursor = begin;
  const timings: LabelTiming[] = labels.map((label) => {
    const start = cursor;
    let time = start + labelTextDelayMs;
    const lines = label.text.map((line) => {
      const lineStart = time;
      time += line.length * labelLetterMs + labelLineGapMs;
      return lineStart;
    });
    cursor = time + labelGapMs;
    return { start, lines };
  });
  return { timings, end: cursor };
};

export const visibleLetters = (line: string, lineStart: number, elapsed: number) =>
  Math.max(0, Math.min(line.length, Math.floor((elapsed - lineStart) / labelLetterMs)));
