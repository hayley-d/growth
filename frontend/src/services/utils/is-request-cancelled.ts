import { isCancel } from "axios";

export const isRequestCancelled = (error: unknown): boolean =>
  isCancel(error) || (error as { cancelled?: boolean } | null | undefined)?.cancelled === true;
