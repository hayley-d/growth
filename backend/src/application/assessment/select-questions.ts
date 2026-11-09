import { attemptLength } from "@/domain/assessment/attempt-score";

export type Random = () => number;

export const pickQuestions = <Item>(
  pool: readonly Item[],
  random: Random,
  count: number = attemptLength,
): Item[] => {
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const kept = shuffled[index] as Item;
    shuffled[index] = shuffled[swapIndex] as Item;
    shuffled[swapIndex] = kept;
  }
  return shuffled.slice(0, count);
};

export const maximumSeed = 2 ** 31 - 1;

export const pickSeed = (random: Random): number => Math.floor(random() * maximumSeed);
