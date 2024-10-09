import type { MessagePayload, WebhookMessageCreateOptions } from "discord.js";
import { env } from "@/utils/env/env.util";
import { anyToError, defaultLogger } from "arcscord";
import { WebhookClient } from "discord.js";

export const webhook = new WebhookClient({
  url: env.WEBHOOK_URL,
});

export async function sendLog(message: string | MessagePayload | WebhookMessageCreateOptions): Promise<void> {
  try {
    await webhook.send(message);
  }
  catch (e) {
    defaultLogger.warning(`Failed to send webhook : ${anyToError(e).message}`);
  }
}
