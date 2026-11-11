export const parseTraversalAnswer = (text: string): number[] | null => {
  const parts = text.split(/[\s,]+/).filter((part) => part.length > 0);
  if (parts.length === 0 || parts.some((part) => !/^-?\d+$/.test(part))) return null;
  return parts.map(Number);
};
