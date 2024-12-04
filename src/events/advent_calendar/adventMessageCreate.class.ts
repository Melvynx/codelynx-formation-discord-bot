import type { EventHandleResult } from "arcscord";
import { env } from "@/utils/env/env.util";
import { updateAdventMessageCountQuery } from "@/utils/prisma/queries/adventChallenge/updateAdventMessageCount.query";
import { error, Event, EventError, ok } from "arcscord";
import { ChannelType, GuildMember, type Message } from "discord.js";

export class AdventMessageCreate extends Event<"messageCreate"> {
  event = "messageCreate" as const;

  name = "AdventMessageCreate";

  async handle(message: Message): Promise<EventHandleResult> {
    if (message.author.bot)
      return ok("Message author is a bot");
    if (message.guildId !== env.SERVER_ID)
      return ok("Message guild id is not the server id");
    if (message.channel.type !== ChannelType.PublicThread)
      return ok("Message channel type is not a public thread");
    if (message.channel.parentId !== env.ADVENT_CHALLENGE_CHANNEL_ID)
      return ok("Message channel parent id is not the advent challenge channel id");

    const author = await message.guild?.members.fetch(message.author.id);
    if (!author) {
      return error(
        new EventError({
          event: this,
          message: `Unable to fetch the author message member with id ${message.author.id}`,
          debugs: {
            get: author,
            except: GuildMember,
          },
        }),
      );
    }

    const messages = (await message.channel.messages.fetch()).map(m => m);

    if (
      !messages.some(m => m.author.id === author.id && m.id !== message.id)
      || author.permissions.has("ManageThreads")
    ) {
      await updateAdventMessageCountQuery(author.id);
      return ok("Author has not already posted a solution or has manage threads permission");
    }

    const messageReply = await message.reply(
      `Doucement l'ami !
Il semblerais que tu ai deja poster ta solution *tu ne peut en poster* ***qu'une seule*** *par algo*
      
*Ce message ainsi que celui que tu as mis seront supprimer automatiquement dans 60 secondes*`,
    );

    await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    await messageReply.delete();
    await message.delete();

    await author.send(`Hello, tu à poster plusieurs solutions dans le [channel de l'événement de l'avent](https://discord.com/channels/${env.SERVER_ID}/${message.channelId}). Tu ne peut en poster qu'une seule par jour. Le message que tu as poster à été supprimer.\nVoici le message que tu as poster:\n${message.content}`);

    return ok(true);
  }
}
