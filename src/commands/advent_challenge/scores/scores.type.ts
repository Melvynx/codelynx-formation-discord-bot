import { z } from "zod";

export const adventScoreSchema = z.object({
  userId: z.string(),
  ticketCount: z.number(),
});
export const adventScoresSchema = z.array(adventScoreSchema);

export type adventScore = z.infer<typeof adventScoreSchema>;
export type adventScores = z.infer<typeof adventScoresSchema>;
