import type { SessionResponse } from "@shared/schemas/auth";

export type RouterContext = {
  session: SessionResponse;
};
