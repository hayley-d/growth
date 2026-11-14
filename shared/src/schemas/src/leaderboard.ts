import { z } from "zod";

const leaderboardEntrySchema = z.object({
  rank: z.int().min(1),
  displayName: z.string(),
  timeSeconds: z.int().min(0),
  isMe: z.boolean(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

const leaderboardMeSchema = z.object({
  displayName: z.string(),
  rank: z.int().min(1).nullable(),
  timeSeconds: z.int().min(0),
  hidden: z.boolean(),
});

export type LeaderboardMe = z.infer<typeof leaderboardMeSchema>;

export const leaderboardResponseSchema = z.object({
  data: z.object({
    top: z.array(leaderboardEntrySchema).max(10),
    me: leaderboardMeSchema.nullable(),
  }),
});

export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;

export const toLeaderboardResponse = (
  data: z.input<typeof leaderboardResponseSchema>["data"],
): LeaderboardResponse => leaderboardResponseSchema.parse({ data });
