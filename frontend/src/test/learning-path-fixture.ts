import type { LearningPathResponse } from "@shared/schemas";

const lessons = [
  ["What is a binary tree", "lesson"],
  ["Pre-order", "lesson"],
  ["In-order", "lesson"],
  ["Post-order", "lesson"],
  ["Level-order", "lesson"],
  ["Traversal checkpoint", "checkpoint"],
  ["Height and balance factor", "lesson"],
  ["Single rotations", "lesson"],
  ["Double rotations", "lesson"],
  ["Inserting into an AVL tree", "lesson"],
  ["Deleting from an AVL tree", "lesson"],
  ["AVL final challenge", "checkpoint"],
] as const;

export const lessonIdAt = (index: number) =>
  `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;

export const buildLearningPath = (completedCount: number): LearningPathResponse => {
  const unitTitles = ["Binary trees and traversals", "AVL trees"];
  const units = unitTitles.map((title, unitIndex) => {
    const unitLessons = lessons
      .slice(unitIndex * 6, unitIndex * 6 + 6)
      .map(([lessonTitle, kind], position) => {
        const index = unitIndex * 6 + position;
        const status =
          index < completedCount ? "completed" : index === completedCount ? "current" : "locked";
        return {
          id: lessonIdAt(index),
          title: lessonTitle,
          summary: `Summary of ${lessonTitle}.`,
          kind,
          position: position + 1,
          status,
        } as const;
      });
    const done = unitLessons.filter((lesson) => lesson.status === "completed").length;
    return {
      id: `10000000-0000-4000-8000-00000000000${unitIndex + 1}`,
      title,
      position: unitIndex + 1,
      progress: Math.round((done / 6) * 100),
      lessons: unitLessons,
    };
  });
  return {
    data: {
      units,
      progress: Math.round((Math.min(completedCount, 12) / 12) * 100),
      currentLessonId: completedCount >= 12 ? null : lessonIdAt(completedCount),
    },
  };
};
