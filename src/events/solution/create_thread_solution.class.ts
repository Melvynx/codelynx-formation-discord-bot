import type { EventHandleResult } from "arcscord";
import type { AnyThreadChannel, ClientEvents } from "discord.js";
import { env } from "@/utils/env/env.util";

import { anyToError, defaultLogger, Event, EventError, ok } from "arcscord";
import { ChannelType } from "discord.js";
import { createPostEmbedBuilder } from "./createPostEmbed.builder";
import { informationEntraideEmbedBuilder } from "./infomationEntraideEmbed.builder";

export class SolutionCreateThread extends Event<"threadCreate"> {
  event = "threadCreate" as const;

  name = "SolutionCreateThread";

  async handle(
    thread: AnyThreadChannel,
    newlyCreated: boolean,
  ): Promise<EventHandleResult> {
    if (
      thread.parentId !== env.HELP_CHANNEL_ID
      || thread.type !== ChannelType.PublicThread
      || !newlyCreated
    ) {
      return ok(true);
    }

    try {
      const createPostEmbed = createPostEmbedBuilder();
      await thread.send({ embeds: [createPostEmbed] });
    }
    catch (e) {
      defaultLogger.logError(new EventError({
        event: this as Event<keyof ClientEvents>,
        message: "failed to send create post embed in the new thread",
        baseError: anyToError(e),
      }));
    }

    try {
      const generalChannel = thread.guild.channels.cache.get(env.GENERAL_CHANNEL_ID);
      if (generalChannel?.type !== ChannelType.GuildText)
        throw new EventError({ event: this as Event<keyof ClientEvents> });

      const informationEmbed = informationEntraideEmbedBuilder(thread.id);
      generalChannel.send({ embeds: [informationEmbed] });
    }
    catch (e) {
      defaultLogger.logError(new EventError({
        event: this as Event<keyof ClientEvents>,
        message: "General channel not found",
        baseError: anyToError(e),
      }));
    }

    return ok("Solution information message send");
  }
}
