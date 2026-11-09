import type { Lesson } from "@/domain/course-content/lesson";

export const getTestPoolLessonIds = (lessons: readonly Lesson[], lesson: Lesson): string[] => {
  if (lesson.kind === "lesson") return [lesson.id];
  const checkpoints = lessons.filter((candidate) => candidate.kind === "checkpoint");
  const finalChallenge = checkpoints[checkpoints.length - 1];
  const scope =
    finalChallenge?.id === lesson.id
      ? lessons
      : lessons.filter((candidate) => candidate.unitId === lesson.unitId);
  return scope.map((candidate) => candidate.id);
};
