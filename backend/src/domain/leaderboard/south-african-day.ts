const southAfricanDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Johannesburg",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const readPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  parts.find((part) => part.type === type)?.value;

export const startOfSouthAfricanDay = (now: Date): Date => {
  const parts = southAfricanDate.formatToParts(now);
  const year = readPart(parts, "year");
  const month = readPart(parts, "month");
  const day = readPart(parts, "day");
  if (!year || !month || !day) throw new Error("Could not read the South African date");
  return new Date(`${year}-${month}-${day}T00:00:00+02:00`);
};
