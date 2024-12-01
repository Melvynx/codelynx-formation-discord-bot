import type {
  CommandRunContext,
  CommandRunResult,
  InteractionDefaultReplyOptions,
  SlashCommand,
} from "arcscord";
import { verifyBuilder } from "@/commands/verify/verify.builder";
import { getUser } from "@/utils/api/codeline/codeline.util";
import { env } from "@/utils/env/env.util";
import { getMemberQuery } from "@/utils/prisma/queries/getMember.query";
import { updateMemberQuery } from "@/utils/prisma/queries/updateMember.query";
import {
  anyToError,
  Command,
  CommandError,
  error,
  ok,
} from "arcscord";
import { EmbedBuilder, type GuildMember } from "discord.js";

export class VerifyCommand extends Command implements SlashCommand {
  slashBuilder = verifyBuilder;

  name = "verify";

  defaultReplyOptions: InteractionDefaultReplyOptions = {
    ephemeral: true,
    preReply: true,
  };

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const email = ctx.interaction.isChatInputCommand() ? ctx.interaction.options.getString("email") : undefined;
    if (!email) {
      return error(new CommandError({
        message: "No email given",
        command: this,
        context: ctx,
        interaction: ctx.interaction,
      }));
    }

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return this.editReply(ctx, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Email invalide")
            .setDescription(`l'email ${email} n'a pas un format valide`)
            .setColor("Red"),
        ],
      });
    }

    const member = await getMemberQuery({
      where: { email },
    });
    if (member) {
      return this.editReply(ctx, "Vous êtes déjà vérifé !");
    }

    const [user, err] = await getUser(email);
    if (err) {
      return error(
        new CommandError({
          message: `failed to get codeline error : ${err.message}`,
          interaction: ctx.interaction,
          context: ctx,
          command: this,
          baseError: err,
        }),
      );
    }

    if (!user) {
      return this.editReply(ctx, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Pas d'utilisateur trouvé")
            .setDescription(
              "Aucun compte codelynx à été trouvé avec cette adresse mail",
            )
            .setColor("Red"),
        ],
      });
    }

    if (user.discordId && user.discordId !== ctx.interaction.user.id) {
      return this.editReply(ctx, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Déjà relié")
            .setDescription(
              `Votre compte a déjà été relier a un utilisateur, si besoins contactez le support. <#${env.CREATE_TICKET_CHANEL_ID}>`,
            )
            .setColor("Red"),
        ],
      });
    }

    if (!ctx.interaction.member || !ctx.interaction.guild) {
      return ok("Not in guild");
    }

    let guildMember: GuildMember;
    try {
      guildMember = await ctx.interaction.guild.members.fetch(ctx.interaction.user.id);
    }
    catch (e) {
      return error(
        new CommandError({
          message: "failed to fetch member",
          context: ctx,
          command: this,
          interaction: ctx.interaction,
          baseError: anyToError(e),
        }),
      );
    }

    const newMember = await updateMemberQuery({
      create: {
        id: user.id,
        email,
        discordUserId: ctx.interaction.user.id,
        products: {
          connectOrCreate: user.products.map(product => ({
            where: {
              id: product.id,
            },
            create: {
              id: product.id,
              name: product.title,
              discordRoleId: "",
              premium: false,
            },
          })),
        },
      },
      where: { id: user.id },
      update: {},
    });

    const roles = newMember.products.filter(p => p.discordRoleId !== "" && p.premium).map(p => p.discordRoleId);

    if (guildMember.roles.cache.hasAll(...roles)) {
      return this.editReply(ctx, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Votre compte a été relié avec succès !")
            .setDescription(
              `Votre compte a été relié avec succès. Et vos roles sont déjà a jour !`,
            )
            .setColor("Green"),
        ],
      });
    }

    try {
      await guildMember.roles.add(roles.filter(role => !guildMember.roles.cache.has(role)));
    }
    catch (e) {
      return error(new CommandError({
        message: "failed to add roles to user",
        interaction: ctx.interaction,
        context: ctx,
        command: this,
        baseError: anyToError(e),
      }));
    }

    return this.editReply(ctx, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Votre compte a été relié avec succès !")
          .setDescription(
            `Votre compte a été relié avec succès. Et vos roles ont été actualisé !`,
          )
          .setColor("Green"),
      ],
    });
  }
}
