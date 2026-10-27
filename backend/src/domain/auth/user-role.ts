export type UserRole = "student" | "admin";

export const hasRole = (roles: string | null | undefined, role: UserRole): boolean =>
  (roles ?? "")
    .split(",")
    .map((value) => value.trim())
    .includes(role);
