import { type MeResponse, meResponseSchema, type UpdateUserProfileRequest } from "@shared/schemas";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";
import { uris } from "@/services/user-service/user.urls";

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await networkService
    .get(uris.meUri)
    .catch((error) => rejectAxios(error, "Unable to load your profile"));

  const parsedData = meResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const updateProfile = async (changes: UpdateUserProfileRequest): Promise<MeResponse> => {
  const { data } = await networkService
    .patch(uris.profileUri, changes)
    .catch((error) => rejectAxios(error, "Unable to save your settings"));

  const parsedData = meResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const userService = {
  getMe,
  updateProfile,
};
