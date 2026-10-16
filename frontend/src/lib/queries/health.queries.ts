import { useQuery } from "@tanstack/react-query";

import { healthService } from "@/services/health-service";

export const healthQueryKeys = {
  all: ["health"] as const,
};

export const useHealthQuery = () =>
  useQuery({
    queryKey: healthQueryKeys.all,
    queryFn: healthService.getHealth,
  });
