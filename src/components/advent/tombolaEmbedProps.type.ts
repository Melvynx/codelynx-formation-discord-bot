import { adventScoreSchema, adventScoresSchema } from "@/commands/advent_challenge/scores/scores.type";
import { z } from "zod";

export const tombolaEmbedPropsSchema = z.object({
  participants: adventScoresSchema,
  moreTicket: adventScoreSchema,
  moreMessage: z.object({
    userId: z.string(),
    messageCount: z.number(),
  }),
  quickTime: z.object({
    userId: z.string(),
    responseTime: z.number(),
  }),

  firstReward: adventScoreSchema,
  secondReward: adventScoreSchema,
  thirdReward: adventScoreSchema,
});

export type tombolaEmbedProps = z.infer<typeof tombolaEmbedPropsSchema>;
