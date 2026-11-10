export const tidyText = (text: string) =>
  text
    .trim()
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ");
