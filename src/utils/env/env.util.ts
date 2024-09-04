import "dotenv/config";
import { envSchema } from "./env.z";

const data = envSchema.safeParse(process.env);
if (!data.success) {
  throw data.error;
}
export const env = data.data;