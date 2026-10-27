import type { User } from "@/domain/user/user";
import type { User as UserRow } from "@/generated/prisma/client";

export const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  emailVerified: row.emailVerified,
  image: row.image,
  role: row.role,
  banned: row.banned ?? false,
  banReason: row.banReason,
  banExpires: row.banExpires,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
