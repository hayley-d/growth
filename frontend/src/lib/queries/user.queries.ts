import { queryOptions, useQuery } from "@tanstack/react-query";

import { userService } from "@/services/user-service";

export const userQueryKeys = {
  me: ["user", "me"] as const,
};

export const meQueryOptions = queryOptions({
  queryKey: userQueryKeys.me,
  queryFn: userService.getMe,
});

export const useMeQuery = () => useQuery(meQueryOptions);
