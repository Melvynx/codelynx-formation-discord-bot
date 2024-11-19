import type { EventHandleResult } from "arcscord";
import { env } from "@/utils/env/env.util";
import { error, Event, EventError, ok } from "arcscord";
import { ChannelType, GuildMember, type Message } from "discord.js";

export class AdventMessageUpdate extends Event<"messageUpdate"> {
  event = "messageUpdate" as const;

  name = "AdventMessageUpdate";

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

    if (author.permissions.has("ManageThreads"))
      return ok("Author has manage threads permission and can edit his message");

    const messageReply = await message.reply(`Tu n'as pas le droit de modifier ton message de solution.
Pour avoir essayer de modifier ton message de solution alors que les règles du challenge l'interdisent. Ta solution seras supprimer dans 60 secondes`);

    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    await messageReply.delete();
    await message.delete();
    await message.channel.send(`<@${author.id}> avais publier une solution. Cependant cette dernière à été supprimée due à une modification`);

    await author.send(`Hello, tu à essayer de modifier ta solution dans le [channel de l'événement de l'avent](https://discord.com/channels/${env.SERVER_ID}/${message.channelId}). Tu ne peut pas modifier ta solution une fois postée. La solution que tu as poster à été supprimer.\nVoici le message que tu as poster:\n${message.content}`);

    return ok(true);
  }
}
