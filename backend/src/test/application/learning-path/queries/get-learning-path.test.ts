import { describe, expect, it } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeGetLearningPath } from "@/application/learning-path/queries/get-learning-path";
import type { Lesson } from "@/domain/course-content/lesson";
import type { Unit } from "@/domain/course-content/unit";
import { UnauthorizedError } from "@/domain/errors";
import type { LessonProgress, ProgressStatus } from "@/domain/user/lesson-progress";
import type { UserMastery } from "@/domain/user/user-mastery";

const userId = "user-1";

const units: Unit[] = [
  { id: "00000000-0000-4000-8000-000000000001", title: "Traversals", position: 1, treeMode: "bst" },
  { id: "00000000-0000-4000-8000-000000000002", title: "AVL basics", position: 2, treeMode: "avl" },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Coming soon",
    position: 3,
    treeMode: "avl",
  },
];
const [firstUnit, secondUnit] = units as [Unit, Unit, Unit];

const lesson = (id: string, unitId: string, position: number): Lesson => ({
  id,
  unitId,
  title: `Lesson ${id.slice(-1)}`,
  summary: "Summary",
  notePrompt: "Prompt",
  kind: "lesson",
  position,
  objectives: [],
  isRetired: false,
});

const lessons: Lesson[] = [
  lesson("10000000-0000-4000-8000-000000000001", firstUnit.id, 1),
  lesson("10000000-0000-4000-8000-000000000002", firstUnit.id, 2),
  lesson("10000000-0000-4000-8000-000000000003", secondUnit.id, 1),
  { ...lesson("10000000-0000-4000-8000-000000000004", secondUnit.id, 2), kind: "checkpoint" },
];
const lessonIds = lessons.map((path) => path.id);

const createGetLearningPath = (
  progress: Record<string, ProgressStatus> = {},
  masteries: Record<string, number> = {},
) => {
  const rows: LessonProgress[] = Object.entries(progress).map(([lessonId, status]) => ({
    userId,
    lessonId,
    status,
    completedAt: null,
  }));
  const masteryRows: UserMastery[] = Object.entries(masteries).map(([lessonId, mastery]) => ({
    userId,
    lessonId,
    rating: 1000,
    mastery,
    currentDifficulty: 1,
    updatedAt: new Date("2026-11-11T00:00:00.000Z"),
  }));
  const requestedUserIds: string[] = [];
  const getLearningPath = makeGetLearningPath({
    unitRepository: { listAll: async () => units },
    lessonRepository: { listAll: async () => lessons },
    lessonProgressRepository: {
      listByUserId: async (requestedUserId) => {
        requestedUserIds.push(requestedUserId);
        return rows;
      },
    },
    userMasteryRepository: { listByUserId: async () => masteryRows },
  });
  return { getLearningPath, requestedUserIds };
};

const asLearner = <Result>(callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

const statusesOf = (response: Awaited<ReturnType<ReturnType<typeof makeGetLearningPath>>>) =>
  response.data.units.flatMap((unit) => unit.lessons.map((path) => path.status));

describe("makeGetLearningPath", () => {
  it("returns the units in order with their lessons for a new learner", async () => {
    const { getLearningPath, requestedUserIds } = createGetLearningPath();
    const response = await asLearner(() => getLearningPath());

    expect(requestedUserIds).toEqual([userId]);
    expect(response.data.units.map((unit) => unit.id)).toEqual(units.map((unit) => unit.id));
    expect(response.data.units[0]).toEqual({
      id: firstUnit.id,
      title: "Traversals",
      position: 1,
      progress: 0,
      lessons: [
        {
          id: lessonIds[0],
          title: "Lesson 1",
          summary: "Summary",
          kind: "lesson",
          position: 1,
          status: "current",
          mastery: 0,
        },
        {
          id: lessonIds[1],
          title: "Lesson 2",
          summary: "Summary",
          kind: "lesson",
          position: 2,
          status: "locked",
          mastery: 0,
        },
      ],
    });
    expect(response.data.units[1]?.lessons.map((path) => path.kind)).toEqual([
      "lesson",
      "checkpoint",
    ]);
    expect(response.data.progress).toBe(0);
    expect(response.data.currentLessonId).toBe(lessonIds[0]);
  });

  it("rounds each lesson's stored mastery to a percentage and defaults to zero", async () => {
    const { getLearningPath } = createGetLearningPath({}, { [lessonIds[0] as string]: 0.4567 });
    const response = await asLearner(() => getLearningPath());

    expect(response.data.units.flatMap((unit) => unit.lessons.map((path) => path.mastery))).toEqual(
      [46, 0, 0, 0],
    );
  });

  it("works out statuses, progress and the current lesson from completed rows", async () => {
    const { getLearningPath } = createGetLearningPath({
      [lessonIds[0] as string]: "completed",
      [lessonIds[1] as string]: "completed",
      [lessonIds[2] as string]: "started",
    });
    const response = await asLearner(() => getLearningPath());

    expect(statusesOf(response)).toEqual(["completed", "completed", "current", "locked"]);
    expect(response.data.units.map((unit) => unit.progress)).toEqual([100, 0, 0]);
    expect(response.data.progress).toBe(50);
    expect(response.data.currentLessonId).toBe(lessonIds[2]);
  });

  it("marks lessons after the current one locked even when they are completed later on", async () => {
    const { getLearningPath } = createGetLearningPath({ [lessonIds[2] as string]: "completed" });
    const response = await asLearner(() => getLearningPath());

    expect(statusesOf(response)).toEqual(["current", "locked", "completed", "locked"]);
    expect(response.data.units.map((unit) => unit.progress)).toEqual([0, 50, 0]);
    expect(response.data.progress).toBe(25);
  });

  it("points at the last lesson when every lesson is completed", async () => {
    const { getLearningPath } = createGetLearningPath(
      Object.fromEntries(lessonIds.map((id) => [id, "completed" as const])),
    );
    const response = await asLearner(() => getLearningPath());

    expect(statusesOf(response)).toEqual(["completed", "completed", "completed", "completed"]);
    expect(response.data.progress).toBe(100);
    expect(response.data.currentLessonId).toBe(lessonIds[3]);
  });

  it("gives a unit with no lessons an empty list and zero progress", async () => {
    const { getLearningPath } = createGetLearningPath();
    const response = await asLearner(() => getLearningPath());

    expect(response.data.units[2]).toMatchObject({ progress: 0, lessons: [] });
  });

  it("throws when nobody is signed in", async () => {
    const { getLearningPath } = createGetLearningPath();
    await expect(
      requestContext.run({ requestId: "request-1" }, () => getLearningPath()),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
