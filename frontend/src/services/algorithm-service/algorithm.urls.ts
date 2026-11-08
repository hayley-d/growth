import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  algorithmSnippetUri: (code: string) =>
    `${hostUrl}/algorithms/${encodeURIComponent(code)}/snippet`,
};
