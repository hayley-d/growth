import { queryOptions, useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth-service";

export const authQueryKeys = {
  session: ["auth", "session"] as const,
};

export const sessionQueryOptions = queryOptions({
  queryKey: authQueryKeys.session,
  queryFn: authService.getSession,
});

export const useSessionQuery = () => useQuery(sessionQueryOptions);
