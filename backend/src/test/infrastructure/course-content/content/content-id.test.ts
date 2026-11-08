import { describe, expect, it } from "vitest";

import {
  answerOptionId,
  lessonId,
  questionId,
  unitId,
} from "@/infrastructure/course-content/content/content-id";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("content ids", () => {
  it("gives the same key the same version 5 uuid every time", () => {
    expect(lessonId("pre-order")).toBe(lessonId("pre-order"));
    expect(lessonId("pre-order")).toMatch(uuidPattern);
  });

  it("gives a unit and a lesson with the same key different ids", () => {
    expect(unitId("avl")).not.toBe(lessonId("avl"));
  });

  it("scopes question and option ids to their lesson and question", () => {
    expect(questionId("pre-order", "q1")).not.toBe(questionId("in-order", "q1"));
    expect(answerOptionId("pre-order", "q1", "a")).not.toBe(answerOptionId("pre-order", "q2", "a"));
  });
});
