export type UnitTone = "primary" | "secondary";

export const unitTone = (position: number): UnitTone => (position === 1 ? "primary" : "secondary");
