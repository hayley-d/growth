import { type Health, healthSchema } from "@shared/schemas/health";
import { uris } from "@/services/health-service/health.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getHealth = async (): Promise<Health> => {
  const { data } = await networkService
    .get(uris.healthUri)
    .catch((error) => rejectAxios(error, "Unable to reach the server"));

  const parsedData = healthSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const healthService = {
  getHealth,
};
