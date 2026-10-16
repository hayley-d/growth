import type { AxiosError } from "axios";

import { extractErrorStatus } from "@/services/utils";

export type ValidationIssue = {
  path?: Array<string | number>;
  message?: string;
  code?: string;
};

export type ErrorBody = {
  message?: string;
  issues?: unknown;
};

export class ServiceError extends Error {
  status: number;
  issues: ValidationIssue[];

  constructor(message: string, status = 500, issues: ValidationIssue[] = []) {
    super(message);
    this.name = "ServiceError";
    this.status = status;
    this.issues = issues;
  }
}

export const extractErrorBody = (error: unknown): ErrorBody => {
  const wrapped = (error ?? {}) as {
    serverError?: ErrorBody;
    axiosError?: AxiosError<ErrorBody>;
  };
  return wrapped.serverError ?? wrapped.axiosError?.response?.data ?? {};
};

export const rejectAxios = (error: unknown, fallbackMessage: string): Promise<never> => {
  const body = extractErrorBody(error);
  const issues = Array.isArray(body.issues) ? (body.issues as ValidationIssue[]) : [];
  return Promise.reject(
    new ServiceError(body.message || fallbackMessage, extractErrorStatus(error) || 500, issues),
  );
};

export const rejectInvalidResponse = (): Promise<never> =>
  Promise.reject(new ServiceError("Incorrect data format", 502));
