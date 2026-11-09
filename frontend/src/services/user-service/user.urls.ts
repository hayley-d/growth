import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  meUri: `${hostUrl}/me`,
  profileUri: `${hostUrl}/me/profile`,
};
