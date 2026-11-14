import { type LeaderboardResponse, leaderboardResponseSchema } from "@shared/schemas";
import { uris } from "@/services/leaderboard-service/leaderboard.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const { data } = await networkService
    .get(uris.leaderboardUri)
    .catch((error) => rejectAxios(error, "Unable to load the leaderboard"));

  const parsedData = leaderboardResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const leaderboardService = {
  getLeaderboard,
};
