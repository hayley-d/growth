import { QueryClient } from "@tanstack/react-query";

import { retryUnlessUnauthorized } from "@/services/utils";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: retryUnlessUnauthorized,
    },
  },
});
