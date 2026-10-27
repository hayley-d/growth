import type { authClient } from "@/lib/auth-client";

export type RouterContext = {
  session: (typeof authClient)["$Infer"]["Session"] | null;
};
