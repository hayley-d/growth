import {
  type LearningStyleKey,
  learningStyleKeys,
} from "@/domain/learning-style/learning-style-key";

export const scoreQuiz = (picks: LearningStyleKey[]): LearningStyleKey => {
  const counts = new Map(learningStyleKeys.map((key) => [key, 0]));
  for (const pick of picks) counts.set(pick, (counts.get(pick) ?? 0) + 1);
  return learningStyleKeys.reduce((winner, key) =>
    (counts.get(key) ?? 0) > (counts.get(winner) ?? 0) ? key : winner,
  );
};
