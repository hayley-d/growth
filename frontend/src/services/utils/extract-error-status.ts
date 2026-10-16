import { type AxiosError, isAxiosError } from "axios";

export const extractErrorStatus = (error: unknown): number | undefined => {
  const wrapped = error as { statusCode?: unknown; axiosError?: AxiosError } | null;
  if (typeof wrapped?.statusCode === "number" && wrapped.statusCode > 0) {
    return wrapped.statusCode;
  }
  if (wrapped?.axiosError) return wrapped.axiosError.response?.status;
  if (isAxiosError(error)) return error.response?.status;
  return undefined;
};
