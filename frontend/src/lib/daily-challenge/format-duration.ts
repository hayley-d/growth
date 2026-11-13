const secondsPerMinute = 60;
const secondsPerHour = 60 * secondsPerMinute;

const twoDigits = (value: number) => value.toString().padStart(2, "0");

export const formatDuration = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / secondsPerHour);
  const minutes = Math.floor((seconds % secondsPerHour) / secondsPerMinute);
  const remainder = seconds % secondsPerMinute;
  return hours > 0
    ? `${hours}:${twoDigits(minutes)}:${twoDigits(remainder)}`
    : `${minutes}:${twoDigits(remainder)}`;
};

export const describeDuration = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const parts = [
    [Math.floor(seconds / secondsPerHour), "hour"],
    [Math.floor((seconds % secondsPerHour) / secondsPerMinute), "minute"],
    [seconds % secondsPerMinute, "second"],
  ] as const;
  const spoken = parts
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value} ${unit}${value === 1 ? "" : "s"}`);
  return spoken.length > 0 ? spoken.join(" ") : "0 seconds";
};

export const secondsBetween = (from: number, to: number): number =>
  Math.max(0, Math.floor((to - from) / 1000));
