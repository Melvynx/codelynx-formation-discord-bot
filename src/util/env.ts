import "dotenv/config";
import { z } from "zod";

const envDTO = z.object({
  TOKEN: z.string(),
  LINKS_CHANNEL_ID: z.string(),
  SERVER_ID: z.string(),
})


const parser = envDTO.safeParse(process.env);

if (!parser.success) throw Error(`Missing environment variable : ${parser.error.message}`);

export const env = parser.data;
