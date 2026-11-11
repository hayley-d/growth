export const learningStyleKeys = ["visual", "auditory", "reading-writing", "kinesthetic"] as const;

export type LearningStyleKey = (typeof learningStyleKeys)[number];

export const learningStyleNames: Record<LearningStyleKey, string> = {
  visual: "Visual",
  auditory: "Auditory",
  "reading-writing": "Reading/writing",
  kinesthetic: "Kinesthetic",
};
