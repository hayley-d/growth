import { describe, expect, it } from "vitest";

import { buildLessonTree, lessonPositions, walkToLesson } from "@/lib/learning-path/lesson-tree";

const parentsOf = (count: number) => buildLessonTree(count).map((node) => node.parent);

describe("buildLessonTree", () => {
  it("roots 12 lessons at index 6 and balances both sides", () => {
    expect(parentsOf(12)).toEqual([1, 3, 1, 6, 5, 3, null, 8, 9, 6, 11, 9]);
    expect(buildLessonTree(12).map((node) => node.depth)).toEqual([
      3, 2, 3, 1, 3, 2, 0, 3, 2, 1, 3, 2,
    ]);
  });

  it("builds a full tree for an odd count of 7", () => {
    expect(parentsOf(7)).toEqual([1, 3, 1, null, 5, 3, 5]);
  });

  it("handles no lessons and one lesson", () => {
    expect(buildLessonTree(0)).toEqual([]);
    expect(buildLessonTree(1)).toEqual([{ index: 0, parent: null, depth: 0 }]);
  });
});

describe("walkToLesson", () => {
  it("goes up to the shared node, then down, from lesson 1 to lesson 5", () => {
    expect(walkToLesson(12, 4)).toEqual([0, 1, 2, 1, 3, 5, 4]);
  });

  it("stops on the root when the root is current", () => {
    expect(walkToLesson(12, 6)).toEqual([0, 1, 2, 1, 3, 5, 4, 5, 3, 6]);
  });

  it("is just the first lesson when the first lesson is current", () => {
    expect(walkToLesson(12, 0)).toEqual([0]);
    expect(walkToLesson(1, 0)).toEqual([0]);
  });

  it("is empty with no lessons", () => {
    expect(walkToLesson(0, 0)).toEqual([]);
  });

  it.each([7, 12])(
    "only follows edges and visits every lesson in order up to the last of %i",
    (count) => {
      const nodes = buildLessonTree(count);
      const walk = walkToLesson(count, count - 1);
      walk.slice(1).forEach((step, position) => {
        const previous = walk[position];
        expect(nodes[step]?.parent === previous || nodes[previous ?? -1]?.parent === step).toBe(
          true,
        );
      });
      let cursor = 0;
      for (const node of nodes) {
        cursor = walk.indexOf(node.index, cursor);
        expect(cursor).toBeGreaterThanOrEqual(0);
      }
      expect(walk.at(-1)).toBe(count - 1);
    },
  );
});

describe("lessonPositions", () => {
  it("gives each lesson a column top-down and a row sideways", () => {
    const nodes = buildLessonTree(12);
    const topDown = lessonPositions(nodes, "top-down");
    const sideways = lessonPositions(nodes, "sideways");
    expect(topDown[6]?.x).toBeCloseTo(54.17);
    expect(topDown[6]?.y).toBe(12.5);
    expect(topDown[0]?.x).toBeCloseTo(4.17);
    expect(topDown[0]?.y).toBe(87.5);
    expect(topDown[9]).toEqual({ x: 79.16666666666666, y: 37.5 });
    expect(sideways).toEqual(topDown.map(({ x, y }) => ({ x: y, y: x })));
  });

  it("centres a single lesson and is empty with none", () => {
    expect(lessonPositions(buildLessonTree(1), "top-down")).toEqual([{ x: 50, y: 50 }]);
    expect(lessonPositions([], "sideways")).toEqual([]);
  });
});
