import type { DailyActivity } from "@/domain/user/daily-activity";

export type ActivityDay = Pick<DailyActivity, "date" | "count">;

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function toDayNumber(date: Date): number {
  return Math.floor(date.getTime() / millisecondsPerDay);
}

function getActiveDayNumbers(days: readonly ActivityDay[]): Set<number> {
  return new Set(days.filter((day) => day.count > 0).map((day) => toDayNumber(day.date)));
}

export function getCurrentStreak(days: readonly ActivityDay[], today: Date): number {
  const activeDayNumbers = getActiveDayNumbers(days);
  const todayNumber = toDayNumber(today);
  let dayNumber = activeDayNumbers.has(todayNumber) ? todayNumber : todayNumber - 1;
  let streak = 0;

  while (activeDayNumbers.has(dayNumber)) {
    streak += 1;
    dayNumber -= 1;
  }

  return streak;
}

export function getLongestStreak(days: readonly ActivityDay[]): number {
  const activeDayNumbers = getActiveDayNumbers(days);
  let longest = 0;

  for (const dayNumber of activeDayNumbers) {
    if (activeDayNumbers.has(dayNumber - 1)) {
      continue;
    }
    let length = 1;
    while (activeDayNumbers.has(dayNumber + length)) {
      length += 1;
    }
    longest = Math.max(longest, length);
  }

  return longest;
}
