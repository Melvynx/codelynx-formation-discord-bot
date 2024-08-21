import type { CommandRunContext, CommandRunResult } from "arcscord";
import { Command, CommandError, error } from "arcscord";
import { SubCommand } from "arcscord";
import type { ButtonBuilder } from "discord.js";
import { ActionRowBuilder, EmbedBuilder } from "discord.js";
import { verifyButtonBuilder } from "../../../components/verify_button/verify_button.builder";

export class SetupVerifySubCommand extends SubCommand {

  subName = "verify";

  subGroup = "setup";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const embed = new EmbedBuilder()
      .setTitle("Vérification")
      .setDescription("Pour accéder à ce serveur, cliquez sur le bouton si dessous pour vérifier votre compte !")
      .setColor("#6CEEF5");

    const components = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(verifyButtonBuilder);

    try {
      await ctx.interaction.channel?.send({
        embeds: [embed],
        components: [components],
      });
    } catch (e) {
      return error(new CommandError({
        command: this,
        context: ctx,
        interaction: ctx.interaction,
        message: "failed to send message",
      }));
    }
    return this.reply(ctx, {
      ephemeral: true,
      content: "success",
    });
  }

}