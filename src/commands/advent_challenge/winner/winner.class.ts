import type { CommandRunContext, CommandRunResult, MessageCommand } from "arcscord";
import type { GuildMember, PublicThreadChannel } from "discord.js";
import { env } from "@/utils/env/env.util";
import { displayName } from "@/utils/format/formatUser";
import { LynxLogger } from "@/utils/log/log.util";
import { AdventChallengeAddTicketQuery } from "@/utils/prisma/queries/adventChallenge/adventChallengeAddTicket.query";
import { anyToError, Command, ok } from "arcscord";
import { ChannelType, EmbedBuilder, ThreadAutoArchiveDuration } from "discord.js";
import { adventWinnerMessageBuilder } from "./winner.builder";

export class WinnerCommand extends Command implements MessageCommand {
  messageBuilder = adventWinnerMessageBuilder;

  name = "Gagnant du jour de l'algo";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const forumChannel = await this.client.channels.fetch(env.ADVENT_CHALLENGE_CHANNEL_ID);
    if (!forumChannel)
      return ok("Channel not found");

    if (
      !ctx.interaction.channel
      || ctx.interaction.channel.type !== ChannelType.PublicThread
      || ctx.interaction.channel.parentId !== forumChannel.id
      || ctx.interaction.guildId !== env.SERVER_ID
      || !ctx.interaction.isMessageContextMenuCommand()
    ) {
      return this.reply(ctx, {
        content: "Vous ne pouvez pas faire ceci à cet endroit.",
        ephemeral: true,
      });
    }

    const thread = ctx.interaction.channel;

    const memberCallInteraction = ctx.interaction.member as GuildMember;

    if (this.isAdventDayAllReadyResolved(thread)) {
      return this.reply(ctx, {
        content: "Ce algo est déjà marquer comme résolu.",
        ephemeral: true,
      });
    }

    if (
      !memberCallInteraction.permissions.has("ManageThreads")
    ) {
      return this.reply(ctx, {
        content:
          "Vous n'avez pas la permission de marquer ce algo comme résolu.",
        ephemeral: true,
      });
    }

    const firstMessage = await thread.fetchStarterMessage();
    if (!firstMessage) {
      LynxLogger.warn(`WinnerCommand => Impossible de récupérer le message d'origine du thread ${thread.id}`);
      return ok("Impossible de récupérer le message d'origine du thread");
    }

    const message = ctx.interaction.targetMessage;

    void message.react("✅");

    await thread.setAppliedTags([
      env.RESOLVED_ADVENT_TAG_ID,
      ...thread.appliedTags,
    ]);

    await thread.setAutoArchiveDuration(ThreadAutoArchiveDuration.OneHour);

    const embed = new EmbedBuilder()
      .setTitle("✅ **Succès !**")
      .setDescription(
        `Le challenge d'aujourd'hui a été résolu avec succès.`,
      )
      .addFields({
        name: "Message de résolution",
        value: `[Clique Ici](${message.url})`,
        inline: false,
      })
      .setColor("#01be61");

    await this.reply(ctx, { embeds: [embed] });
    await thread.setArchived(true);

    try {
      const timeToResponse = message.createdTimestamp - firstMessage.createdTimestamp;
      await AdventChallengeAddTicketQuery({ discordId: message.author.id, messageId: message.id, timeToResponse });
    }
    catch (e) {
      LynxLogger.warn(`WinnerCommand => Une erreur est survenue lors de l'ajout d'un ticket à ${displayName(message.author)} pour le message ${message.id}\n ${anyToError(e)}`);
    }

    return ok(true);
  }

  isAdventDayAllReadyResolved = (thread: PublicThreadChannel): boolean => {
    return (
      thread.appliedTags.findIndex(t => t === env.RESOLVED_ADVENT_TAG_ID) !== -1
    );
  };
}
