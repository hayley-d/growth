import { type AxiosError, type AxiosInstance, isCancel } from "axios";

import type { ErrorObject } from "@/services/utils/interceptors/types";

const toErrorObject = (axiosError: AxiosError): ErrorObject<unknown> => {
  const statusCode = axiosError.response?.status ?? 0;
  return {
    statusCode,
    message: axiosError.message || `Request failed with status code ${statusCode}`,
    serverError: axiosError.response?.data ?? {},
    axiosError,
  };
};

const toCancelledObject = (): ErrorObject<unknown> => ({
  statusCode: 0,
  message: "Request cancelled",
  cancelled: true,
});

export const createNetworkErrorHandlerInterceptor = (axiosInstance: AxiosInstance) =>
  axiosInstance.interceptors.response.use(undefined, (error: unknown) => {
    if (isCancel(error)) return Promise.reject(toCancelledObject());
    return Promise.reject(toErrorObject(error as AxiosError));
  });
