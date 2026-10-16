import type { AxiosError } from "axios";

export type ErrorObject<Value> = {
  statusCode: number;
  message: string;
  cancelled?: true;
  serverError?: Value;
  axiosError?: AxiosError;
};
