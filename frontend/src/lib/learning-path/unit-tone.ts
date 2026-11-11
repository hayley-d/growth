export type UnitTone = "primary" | "secondary" | "accent";

export const unitTone = (position: number): UnitTone => (position === 1 ? "secondary" : "accent");
