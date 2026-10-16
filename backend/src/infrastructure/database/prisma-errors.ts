import { BadRequestError, ConflictError, NotFoundError } from "@/domain/errors";
import { Prisma } from "@/generated/prisma/client";

const readConflictFields = (meta: Record<string, unknown> | undefined): string[] => {
  const target = meta?.target;
  if (Array.isArray(target)) return target.map(String);
  if (typeof target === "string") return [target];
  const driverAdapterError = meta?.driverAdapterError as
    | { cause?: { constraint?: { fields?: unknown } } }
    | undefined;
  const fields = driverAdapterError?.cause?.constraint?.fields;
  return Array.isArray(fields) ? fields.map(String) : [];
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
  if (error.code === "P2003") throw new BadRequestError("A related record does not exist");

  throw error;
};

export const withPrismaErrors = <Result>(action: () => Promise<Result>): Promise<Result> =>
  action().catch(translatePrismaError);
