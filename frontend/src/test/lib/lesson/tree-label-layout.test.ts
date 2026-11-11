import { describe, expect, it } from "vitest";

import {
  labelLetterMs,
  labelTextDelayMs,
  labelTimeline,
  layoutTreeLabels,
  visibleLetters,
} from "@/lib/lesson/tree-label-layout";

const points = new Map([
  [8, { cx: 100, cy: 40 }],
  [4, { cx: 50, cy: 110 }],
  [12, { cx: 150, cy: 110 }],
]);
const base = { width: 190, height: 150 };

describe("layoutTreeLabels", () => {
  it("leaves the frame alone with no labels", () => {
    expect(layoutTreeLabels([], points, base, 18)).toEqual({ ...base, placed: [] });
  });

  it("widens the frame for a right label and starts the leader at the node's edge", () => {
    const layout = layoutTreeLabels(
      [{ text: ["8 is the root"], keys: [8], place: "right" }],
      points,
      base,
      18,
    );
    expect(layout.width).toBeGreaterThan(base.width);
    expect(layout.height).toBe(base.height);
    expect(layout.placed[0]?.leaders).toEqual(["M 124 40 H 198"]);
    expect(layout.placed[0]?.text).toEqual({ x: 206, y: 45, anchor: "start" });
  });

  it("puts a bracket under the nodes of a below label and grows the frame for its lines", () => {
    const layout = layoutTreeLabels(
      [{ text: ["Children", "of 8"], keys: [4, 12], place: "below" }],
      points,
      base,
      18,
    );
    expect(layout.height).toBe(base.height + 44 + 2 * 18);
    expect(layout.placed[0]?.bracket).toBe("M 32 136 V 142 H 168 V 136");
    expect(layout.placed[0]?.text.anchor).toBe("middle");
  });

  it("joins every node of a side label to one bracket", () => {
    const layout = layoutTreeLabels(
      [{ text: ["Path"], keys: [8, 12], place: "side" }],
      points,
      base,
      18,
    );
    expect(layout.placed[0]?.leaders).toHaveLength(2);
    expect(layout.placed[0]?.bracket).toBe("M 188 22 H 194 V 128 H 188");
  });

  it("skips a label pointing at a node that isn't drawn", () => {
    const layout = layoutTreeLabels(
      [{ text: ["Missing"], keys: [99], place: "right" }],
      points,
      base,
      18,
    );
    expect(layout.placed).toEqual([]);
  });
});

describe("labelTimeline", () => {
  it("writes each label after the one before it", () => {
    const { timings } = labelTimeline([
      { text: ["ab"], keys: [8], place: "right" },
      { text: ["c"], keys: [4], place: "below" },
    ]);
    expect(timings[0]).toEqual({ start: 0, lines: [labelTextDelayMs] });
    expect(timings[1]?.start).toBeGreaterThan(labelTextDelayMs + 2 * labelLetterMs);
  });

  it("shows letters as time passes", () => {
    expect(visibleLetters("root", 100, 50)).toBe(0);
    expect(visibleLetters("root", 100, 100 + 2 * labelLetterMs)).toBe(2);
    expect(visibleLetters("root", 100, Number.POSITIVE_INFINITY)).toBe(4);
  });
});
