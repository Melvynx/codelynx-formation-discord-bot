import { env } from "@/utils/env/env.util";
import type { EventHandleResult } from "arcscord";
import { error, Event, EventError, ok } from "arcscord";
import { ChannelType, GuildMember, type Message } from "discord.js";

export class AdventMessageCreate extends Event<"messageCreate"> {

  event = "messageCreate" as const;

  name = "AdventMessageCreate";

  async handle(message: Message): Promise<EventHandleResult> {
    if (message.author.bot) return ok(true);
    if (message.guildId !== env.SERVER_ID) return ok(true);
    if (message.channel.type != ChannelType.PublicThread) return ok(true);
    if (message.channel.parentId != env.ADEVENT_CHALLENGE_CHANNEL_ID) return ok(true);

    const author = await message.guild?.members.fetch(message.author.id);
    if (!author) return error(
      new EventError({
        event: this,
        message: `Unable to fetch the author message member with id ${message.author.id}`,
        debugs: {
          get: author,
          except: GuildMember,
        },
      })
    );

    const messages = (await message.channel.messages.fetch()).map(m => m);

    if (
      !messages.some(m => m.author.id === author.id && m.id !== message.id)
      || author.permissions.has("ManageThreads")
    ) return ok(true);

    const messageReply = await message.reply(
      `Doucement l'ami !
Il semblerais que tu ai deja poster ta solution *tu ne peut en poster* ***qu'une seule*** *par jour*
      
*Ce message ainsi que celui que tu as mis seront supprimer automatiquement dans 60 secondes*`
    );

    await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    await messageReply.delete();
    await message.delete();

    return ok(true);
  }

}