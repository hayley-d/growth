import { extractErrorStatus } from "@/services/utils/extract-error-status";

const maximumQueryRetries = 3;

const readStatus = (error: unknown): number | undefined => {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : extractErrorStatus(error);
};

export const retryUnlessUnauthorized = (failureCount: number, error: Error): boolean => {
  const status = readStatus(error);
  if (status === 401 || status === 403) return false;
  return failureCount < maximumQueryRetries;
};
