import {
  ApplicationCommandType,
  ChannelType,
  Client,
  Events,
  InteractionType,
  ThreadChannel,
} from 'discord.js';
import { env } from '../../util/env';
import {
  MarkResolved,
  sendHelpChanelInformation,
} from './markResolved.command';

export const helpChannelHandler = async (client: Client) => {
  const getHelpChannel = () => client.channels.fetch(env.HELP_CHANNEL_ID);

  client.on(Events.ThreadCreate, async (thread: ThreadChannel) => {
    try {
      if (thread.type !== ChannelType.PublicThread) {
        console.error('invalid channel');
        return;
      }

      if (
        thread.guildId !== env.SERVER_ID ||
        thread.parentId !== env.HELP_CHANNEL_ID
      ) {
        return;
      }

      await sendHelpChanelInformation(thread);
    } catch (e) {
      console.error(e);
    }
  });

  client.on(Events.InteractionCreate, async interaction => {
    try {
      const helpChannel = await getHelpChannel();

      if (
        interaction.type != InteractionType.ApplicationCommand ||
        interaction.commandType != ApplicationCommandType.Message ||
        !helpChannel ||
        helpChannel.type !== ChannelType.GuildForum ||
        interaction.channel?.type != ChannelType.PublicThread
      )
        return;

      if (
        interaction.channel.parentId != helpChannel.id ||
        interaction.guildId !== env.SERVER_ID
      )
        return;

      if (interaction.commandName === 'Marquer comme solution')
        return MarkResolved(interaction);
    } catch (e) {
      console.error(e);
    }
  });
};
