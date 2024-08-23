import { z } from "zod";

export const envSchema = z.object({
  TOKEN: z.string(),

  SERVER_ID: z.string(),

  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  GOOGLE_API_KEY: z.string(),
  CODELINE_TOKEN: z.string(),
  CODELINE_ENDPOINT: z.string(),

  LINKS_CHANNEL_ID: z.string(),
  HELP_CHANNEL_ID: z.string(),
  PRESENTATION_CHANNEL: z.string(),
  WELCOME_CHANNEL: z.string(),

  MODERATOR_ROLE_ID: z.string(),
  VERIFY_ROLE_ID: z.string(),
  LYNX_ROLE_ID: z.string(),

  RESOLVED_THREAD_TAG_ID: z.string(),
});