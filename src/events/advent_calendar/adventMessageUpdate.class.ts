import { env } from "@/utils/env/env.util";
import type { EventHandleResult } from "arcscord";
import { error, Event, EventError, ok } from "arcscord";
import { ChannelType, GuildMember, type Message } from "discord.js";

export class AdventMessageUpdate extends Event<"messageUpdate"> {

  event = "messageUpdate" as const;

  name = "AdventMessageUpdate";

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

    if (author.permissions.has("ManageThreads")) return ok(true);

    const messageReply = await message.reply(`Tu n'as pas le droit de modifier ton message de solution.
Pour avoir essayer de modifier ton message de solution alors que les règles du challenge l'interdisent. Ta solution seras supprimer dans 60 secondes`);

    await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    await messageReply.delete();
    await message.delete();
    await message.channel.send(`<@${author.id}> avais publier une solution. Cependant cette dernière à été supprimée due à une modification`);
  }

}