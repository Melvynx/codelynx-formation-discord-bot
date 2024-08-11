import { z } from "zod";

export const envSchema = z.object({
  TOKEN: z.string(),
  LINKS_CHANNEL_ID: z.string(),
  SERVER_ID: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
});