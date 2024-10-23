import type { EventHandleResult } from "arcscord";
import type { ClientEvents, NonThreadGuildBasedChannel } from "discord.js";
import { env } from "@/utils/env/env.util";
import { LynxLogger } from "@/utils/log/log.util";
import { anyToError, defaultLogger, Event, EventError, ok } from "arcscord";
import { ChannelType } from "discord.js";

export class ClosedTicketLimit extends Event<"channelUpdate"> {
  event = "channelUpdate" as const;

  name = "ClosedTicketLimit";

  async handle(oldChannel: NonThreadGuildBasedChannel, newChannel: NonThreadGuildBasedChannel): Promise<EventHandleResult> {
    if (oldChannel.parentId !== env.CLAIMED_TICKET_CATEGORY_ID && oldChannel.parentId !== env.CREATE_TICKET_CATEGORY_ID && newChannel.parentId !== env.CLOSED_TICKET_CATEGORY_ID)
      return ok(true);

    if (newChannel.type !== ChannelType.GuildText)
      return ok(true);

    if (newChannel.guildId !== env.SERVER_ID)
      return ok(true);

    const category = newChannel.guild.channels.cache.get(env.CLOSED_TICKET_CATEGORY_ID);

    if (!category || category.type !== ChannelType.GuildCategory) {
      defaultLogger.warning("Failed to get closed ticket category");
      return ok(true);
    }

    const channels = await category.children.cache
      .filter(c => c.type === ChannelType.GuildText)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
      .map(c => c);

    if (channels.length < env.CLOSED_TICKET_LIMIT)
      return ok(true);

    for (let i = 0; i < channels.length - env.CLOSED_TICKET_LIMIT; i++) {
      const channel = channels[i];
      if (category.children.cache.has(channel.id))
        category.children.cache.delete(channel.id);

      try {
        category.children.cache.delete(channel.id);
        await channel.delete();
        LynxLogger.info(`Deleted closed ticket channel (${channel.name})`);
      }
      catch (e) {
        defaultLogger.logError(new EventError({
          event: this as Event<keyof ClientEvents>,
          message: `failed to delete closed ticket channel <#${channel.id}>(${channel.name})`,
          baseError: anyToError(e),
        }));
      }
    }
    return ok(true);
  }
}
