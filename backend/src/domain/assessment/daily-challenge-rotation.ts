import { createRandom } from "@shared/avl";

export const challengeTimeZone = "Africa/Johannesburg";

const calendarDate = new Intl.DateTimeFormat("en-CA", { timeZone: challengeTimeZone });

const seedRange = 2 ** 31;

const millisecondsPerHour = 60 * 60 * 1000;

const johannesburgOffsetHours = 2;

export const toChallengeDate = (instant: Date): Date =>
  new Date(`${calendarDate.format(instant)}T00:00:00.000Z`);

export const toNextChallengeAt = (challengeDate: Date): Date =>
  new Date(challengeDate.getTime() + (24 - johannesburgOffsetHours) * millisecondsPerHour);

export const pickChallengeQuestion = <Item extends { id: string }>(
  questions: readonly Item[],
  dayNumber: number,
): Item | null => {
  const sorted = [...questions].sort((first, second) => (first.id < second.id ? -1 : 1));
  return sorted[dayNumber % sorted.length] ?? null;
};

export const toChallengeSeed = (dayNumber: number): number =>
  Math.floor(createRandom(dayNumber)() * seedRange);
