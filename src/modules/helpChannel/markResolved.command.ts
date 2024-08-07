import {
  EmbedBuilder,
  GuildMember,
  MessageContextMenuCommandInteraction,
  PublicThreadChannel,
  ThreadChannel,
} from 'discord.js';
import { env } from '../../util/env';
import { isModerator } from '../../util/roles.helper';

export const sendHelpChanelInformation = async (thread: ThreadChannel) => {
  const embed = new EmbedBuilder()
    .setTitle('Post crée !')
    .setDescription(
      'Une fois le post résolu, vous pouvez marquer le message qui vous a aidé avec : `clic droit` `->` `Applications` `->` `Marquer comme solution.`',
    )
    .setColor('#5865f2');

  await thread.send({ embeds: [embed] });
};

export const MarkResolved = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const thread = interaction.channel as PublicThreadChannel;
  if (thread.ownerId === null) return;

  const threadOwner = await interaction.client.users.fetch(thread.ownerId);
  const memberCallInteraction = interaction.member as GuildMember;

  if (isThreadAllReadyResolved(thread))
    return interaction.reply({
      content: 'Ce post est déjà marquer comme résolu.',
      ephemeral: true,
    });

  if (
    isModerator(memberCallInteraction) &&
    memberCallInteraction.id != '720046808679841803'
  )
    return AddResolvedTagToThread(interaction);

  if (threadOwner.id !== memberCallInteraction.id)
    return interaction.reply({
      content:
        'Vous n’êtes pas le créateur de ce poste. Vous ne pouvez donc pas le définir comme résolu',
      ephemeral: true,
    });

  if (
    interaction.targetMessage.system ||
    interaction.targetMessage.author.id === interaction.client.user.id
  )
    return interaction.reply({
      content: 'message non compatible',
      ephemeral: true,
    });

  return AddResolvedTagToThread(interaction);
};

const isThreadAllReadyResolved = (thread: PublicThreadChannel) => {
  if (
    thread.appliedTags.findIndex(t => t === env.RESOLVED_THREAD_TAG_ID) !== -1
  )
    return true;
  else return false;
};

const AddResolvedTagToThread = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const message = interaction.targetMessage;
  await message.pin();
  message.react('✅');

  const thread = interaction.channel as PublicThreadChannel;
  await thread.setAppliedTags([
    env.RESOLVED_THREAD_TAG_ID,
    ...thread.appliedTags,
  ]);

  const embed = new EmbedBuilder()
    .setTitle('✅ **Succès !**')
    .setDescription(
      `Ce post a été marqué comme résolu. Si vous avez d’autres questions, n’hésitez pas à créer un nouveau post -> <#${env.HELP_CHANNEL_ID}>`,
    )
    .addFields({
      name: 'Message de résolution',
      value: `[Clique Ici](${message.url})`,
      inline: false,
    })
    .setColor('#01be61');

  await interaction.reply({ embeds: [embed] });
};
