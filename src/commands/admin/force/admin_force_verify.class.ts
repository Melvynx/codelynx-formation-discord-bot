import { getUnverifiedMembers } from "@/cron/verification_remeber/verification_remember.helper";
import { getChanelByIdAsync } from "@/utils/chanels/chanels.utils";
import { env } from "@/utils/env/env.util";
import type { CommandRunContext, CommandRunResult } from "arcscord";
import { CommandError, defaultLogger, error, SubCommand } from "arcscord";
import { ChannelType } from "discord.js";
import { getPresentationMessages } from "@/utils/messages/message.util";

export class ForceVerifySubCommand extends SubCommand {

  subName = "force";

  subGroup = "verify";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const [members, memberError] = await getUnverifiedMembers(this.client);

    if (memberError) {
      return error(
        new CommandError({
          message: "failed to get unverified Member list",
          command: this,
          interaction: ctx.interaction,
          context: ctx,
          baseError: memberError,
        })
      );
    }

    const [messages, err] = await getPresentationMessages(this.client);
    if (err) {
      return error(new CommandError({
        message: "failed to fetch presentation messages",
        command: this,
        interaction: ctx.interaction,
        context: ctx,
        baseError: err,
      }));
    }

    for (const member of members) {
      const roles = member.roles.valueOf().map(r => r);
      if (!roles.some(r => r.id === env.VERIFY_ROLE_ID)) continue;
      if (!messages.some(m => m.author.id === member.id)) continue;

      try {
        await member.roles.add(env.LYNX_ROLE_ID);
      } catch (addRoleErr) {
        defaultLogger.warning(`Fail to add Lynx role for ${member.user.username} with id ${member.id}`);
        continue;
      }

      try {
        await member.roles.remove(env.VERIFY_ROLE_ID);
      } catch (removeRoleErr) {
        defaultLogger.warning(`Fail to remove Verification role for ${member.user.username} with id ${member.id}`);
      }

      try {
        await member.send("Bonjour, un petit bug a été détecter avec le bot de Codeline. C'est ce pourquoi tu as reçut des messages les deux dernier jours. Le problème à été solutionner. Ton compte est bien a présent actif ");
      } catch (messageError) {
        defaultLogger.warning(
          `Fail to send message for ${member.user.username} with id ${member.id}`
        );
      }
    }

    return this.reply(ctx, {
      ephemeral: true,
      content: "success",
    });
  }

}