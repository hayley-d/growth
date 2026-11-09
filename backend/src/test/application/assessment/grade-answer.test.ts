import { describe, expect, it } from "vitest";

import type { LearnerAnswer } from "@shared/schemas";
import { gradeAnswer } from "@/application/assessment/grade-answer";

const rotation = (rotationName: "left" | "right", pivotKey: number | null): LearnerAnswer => ({
  type: "predict_rotation",
  rotation: rotationName,
  pivotKey,
});

describe("gradeAnswer", () => {
  it("matches a multiple choice option by id", () => {
    const accepted: LearnerAnswer[] = [{ type: "multiple_choice", optionId: "a" }];
    expect(gradeAnswer({ type: "multiple_choice", optionId: "a" }, accepted)).toBe(true);
    expect(gradeAnswer({ type: "multiple_choice", optionId: "b" }, accepted)).toBe(false);
  });

  it("matches a built tree and ignores surrounding whitespace", () => {
    const accepted: LearnerAnswer[] = [{ type: "build_tree", tree: "2,1,#,#,3,#,#" }];
    expect(gradeAnswer({ type: "build_tree", tree: " 2,1,#,#,3,#,# " }, accepted)).toBe(true);
    expect(gradeAnswer({ type: "build_tree", tree: "2,3,#,#,1,#,#" }, accepted)).toBe(false);
  });

  it("needs node keys in the same order", () => {
    const accepted: LearnerAnswer[] = [{ type: "order_nodes", keys: [1, 2, 3] }];
    expect(gradeAnswer({ type: "order_nodes", keys: [1, 2, 3] }, accepted)).toBe(true);
    expect(gradeAnswer({ type: "order_nodes", keys: [3, 2, 1] }, accepted)).toBe(false);
    expect(gradeAnswer({ type: "order_nodes", keys: [1, 2] }, accepted)).toBe(false);
  });

  it("needs both the rotation and the pivot", () => {
    const accepted = [rotation("left", 10)];
    expect(gradeAnswer(rotation("left", 10), accepted)).toBe(true);
    expect(gradeAnswer(rotation("left", 20), accepted)).toBe(false);
    expect(gradeAnswer(rotation("right", 10), accepted)).toBe(false);
    expect(gradeAnswer(rotation("left", null), accepted)).toBe(false);
  });

  it.each(["pre-order", "  PRE-ORDER ", "Pre - Order", "1, 2, 3"])(
    "accepts %j once trimmed, lowercased and stripped of spaces",
    (text) => {
      const accepted: LearnerAnswer[] = [
        { type: "text", text: "pre-order" },
        { type: "text", text: "1,2,3" },
      ];
      expect(gradeAnswer({ type: "text", text }, accepted)).toBe(true);
    },
  );

  it("rejects a wrong text answer", () => {
    expect(
      gradeAnswer({ type: "text", text: "post-order" }, [{ type: "text", text: "pre-order" }]),
    ).toBe(false);
  });

  it("rejects an answer of another type", () => {
    expect(
      gradeAnswer({ type: "text", text: "1,2,3" }, [{ type: "order_nodes", keys: [1, 2, 3] }]),
    ).toBe(false);
  });
});
