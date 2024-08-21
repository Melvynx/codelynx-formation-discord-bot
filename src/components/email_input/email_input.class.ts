import type {
  ModalSubmitRunContext,
  ModalSubmitRunResult } from "arcscord";
import { ok
} from "arcscord";
import {
  anyToError,
  error,
  ModalSubmitError
} from "arcscord";
import { ModalSubmitComponent } from "arcscord";
import { EMAIL_INPUT_ID } from "./email_input.builder";
import { NEW_LINK_THREAD_NAME_TEXT_ID } from "../new_link_thread_name/new_link_thread_name.builder";
import type { GuildMember } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { getUSer } from "../../utils/api/codeline/codeline.util";
import { env } from "../../utils/env/env.util";

export class EmailInputModal extends ModalSubmitComponent {

  customId = EMAIL_INPUT_ID;

  name = "email_input";

  defaultReplyOptions = {
    ephemeral: true,
    preReply: true,
  };

  async run(ctx: ModalSubmitRunContext): Promise<ModalSubmitRunResult> {
    let email = "";
    try {
      email = ctx.interaction.fields.getTextInputValue(NEW_LINK_THREAD_NAME_TEXT_ID);
    } catch (e) {
      return error(new ModalSubmitError({
        interaction: ctx.interaction,
        message: "missing value in text input",
        baseError: anyToError(e),
      }));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return this.editReply(ctx, {
        embeds: [new EmbedBuilder()
          .setTitle("Email invalide")
          .setDescription(`l'email ${email} n'a pas un format valide`)
          .setColor("Red")],
      });
    }

    const [user, err] = await getUSer(email);
    if (err) {
      return error(new ModalSubmitError({
        message: "failed to get codeline error : " + err.message,
        interaction: ctx.interaction,
        baseError: err,
      }));
    }

    if (!user) {
      return this.editReply(ctx, {
        embeds: [new EmbedBuilder()
          .setTitle("Pas d'utilisateur trouvé")
          .setDescription("Aucun compte codelynx à été trouvé avec cette adresse mail")
          .setColor("Red")],
      });
    }

    if (user.discordId && user.discordId !== ctx.interaction.user.id) {
      return this.editReply(ctx, {
        embeds: [new EmbedBuilder()
          .setTitle("Déjà relié")
          .setDescription("Votre compte a déjà été relier a un utilisateur, si besoins contactez le support.")
          .setColor("Red")],
      });
    }

    if (!ctx.interaction.member || !ctx.interaction.guild) {
      return ok("Not in guild");
    }

    let member: GuildMember;
    try {
      member = await ctx.interaction.guild.members.fetch(ctx.interaction.user.id);
    } catch (e) {
      return error(new ModalSubmitError({
        message: "failed to fetch member",
        interaction: ctx.interaction,
        baseError: anyToError(e),
      }));
    }

    const roles: string[] = [
      env.VERIFY_ROLE_1,
    ];

    for (const product of user.products) {
      roles.push(product.discordRoleId);
    }

    try {
      await member.roles.add(roles);
    } catch (e) {
      return error(new ModalSubmitError({
        message: "failed to add roles",
        interaction: ctx.interaction,
        baseError: anyToError(e),
      }));
    }


    return this.editReply(ctx, {
      embeds: [new EmbedBuilder()
        .setTitle("Validé")
        .setDescription("Votre compte à été validé !")
        .setColor("Green")],
    });
  }

}