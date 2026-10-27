import { BadRequestError, ConflictError, NotFoundError } from "@/domain/errors";
import { Prisma } from "@/generated/prisma/client";

type DriverCause = {
  originalCode?: unknown;
  originalMessage?: unknown;
  constraint?: { fields?: unknown; index?: unknown };
  table?: unknown;
};

const readDriverCause = (meta: Record<string, unknown> | undefined) =>
  (meta?.driverAdapterError as { cause?: DriverCause } | undefined)?.cause;

const readFieldsFromIndex = (cause: DriverCause | undefined): string[] => {
  const index = cause?.constraint?.index;
  const table = cause?.table;
  if (typeof index !== "string" || typeof table !== "string") return [];
  const prefix = `${table}_`;
  const suffix = "_key";
  if (!index.startsWith(prefix) || !index.endsWith(suffix)) return [];
  return [index.slice(prefix.length, -suffix.length)];
};

const readConflictFields = (meta: Record<string, unknown> | undefined): string[] => {
  const target = meta?.target;
  if (Array.isArray(target)) return target.map(String);
  if (typeof target === "string") return [target];
  const cause = readDriverCause(meta);
  const fields = cause?.constraint?.fields;
  return Array.isArray(fields) ? fields.map(String) : readFieldsFromIndex(cause);
};

const checkViolationCode = "23514";

const readConstraintName = (message: unknown) =>
  typeof message === "string" ? message.match(/constraint "([^"]+)"/)?.[1] : undefined;

const isStillReferenced = (meta: Record<string, unknown> | undefined) => {
  const message = readDriverCause(meta)?.originalMessage;
  return typeof message === "string" && message.startsWith("update or delete on table");
};

export const translatePrismaError = (error: unknown): never => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  if (error.code === "P2002") {
    const fields = readConflictFields(error.meta);
    throw new ConflictError(
      fields.length > 0
        ? `A record already exists with ${fields.join(", ")}`
        : "A record with these values already exists",
      { fields },
    );
  }
  if (error.code === "P2025") throw new NotFoundError("Record not found");
  if (error.code === "P2003") {
    if (isStillReferenced(error.meta)) {
      throw new ConflictError("This record is still used by another record");
    }
    throw new BadRequestError("A related record does not exist");
  }
  if (error.code === "P2011") throw new BadRequestError("A required value is missing");
  if (error.code === "P2039") {
    const cause = readDriverCause(error.meta);
    if (cause?.originalCode === checkViolationCode) {
      const constraint = readConstraintName(cause.originalMessage);
      throw new BadRequestError(
        "A value is outside its allowed range",
        constraint ? { constraint } : undefined,
      );
    }
  }

  throw error;
};

export const withPrismaErrors = <Result>(action: () => Promise<Result>): Promise<Result> =>
  action().catch(translatePrismaError);
