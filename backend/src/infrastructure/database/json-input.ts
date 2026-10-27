import { Prisma } from "@/generated/prisma/client";

export const toJsonInput = (value: unknown) =>
  value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);

export const toNullableJsonInput = (value: unknown) =>
  value === null ? Prisma.DbNull : (value as Prisma.InputJsonValue);
