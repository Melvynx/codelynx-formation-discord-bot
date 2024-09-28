import type { ArcClient, Result } from "arcscord";
import { ok } from "arcscord";
import { anyToError, BaseError, error } from "arcscord";
import { getChanelByIdAsync } from "@/utils/chanels/chanels.utils";
import { env } from "@/utils/env/env.util";
import type { Message } from "discord.js";
import { ChannelType } from "discord.js";

export const getPresentationMessages = async(client: ArcClient): Promise<Result<Message[], BaseError>> => {
  let channel;
  const messages = [];

  try {
    channel = await getChanelByIdAsync(client, env.PRESENTATION_CHANNEL_ID);
  } catch (e) {
    return error(
      new BaseError({
        message: "Failed to fetch presentation channel",
        baseError: anyToError(e),
      })
    );
  }

  if (!channel || channel.type !== ChannelType.GuildText) {
    return error(new BaseError({
      message: "invalid presentation channel",
    }));
  }

  try {
    let lastMessageId: string|undefined = undefined;
    for (let i = 0; i < 4; i++) {

      messages.push(...(await channel.messages.fetch({ limit: 100, before: lastMessageId })).map((m) => m));
      messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      lastMessageId = messages[0].id;
    }
    return ok(messages);
  } catch (e) {
    return error(new BaseError({
      message: "failed to fetch message in presentation channel",
      baseError: anyToError(e),
    }));
  }
};