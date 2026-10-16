import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  healthUri: `${hostUrl}/health`,
};
