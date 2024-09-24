import { getTicketsChannels } from "@/utils/chanels/chanels.utils";
import { env } from "@/utils/env/env.util";
import { nameof } from "@/utils/nameof.utils";
import type { TaskResult, TaskType } from "arcscord";
import { anyToError, error, ok, Task, TaskError } from "arcscord";
import { subDays } from "date-fns";
import { verificationKickEmbedBuilder } from "./kick_embed.builder";
import { isUserHaveTicket } from "./verification_remember.helper";
import { verificationWarnEmbedBuilder } from "./warn_embed.builder";

export class VerificationRememberTask extends Task {

  name = "Rappel de vérification";

  type: TaskType = "cron";

  interval = "0 0 4 * * *";

  async run(): Promise<TaskResult> {
    const guild = await this.client.guilds.fetch(env.SERVER_ID);
    if (!guild) return error(
      new TaskError({
        message: "Unable to fetch Codeline Guild",
        task: this,
      })
    );
    const ticketChannels = await getTicketsChannels(
      this.client
    );
    if (!ticketChannels) return error(
      new TaskError({
        message: `Unable to fetch ${nameof(ticketChannels)}`,
        task: this,
      })
    );

    const guildMembers = (await guild.members.fetch()).map(m => m);

    const usersWithoutLynxRole = guildMembers.filter(m => !m.roles.cache.has(env.LYNX_ROLE_ID)
      && !m.user.bot
      && m.joinedTimestamp);
    const membersToKick = usersWithoutLynxRole.filter(
      m => m.joinedTimestamp!
        < subDays(new Date(), Number(env.DAY_TO_KICK)).getTime()
    );
    const membersToWarn = usersWithoutLynxRole.filter(m => !membersToKick.includes(m) && m.joinedTimestamp!
        < subDays(new Date(), Number(env.DAY_TO_WARN)).getTime());

    // console.log("🚀 ~ VerificationRememberTask ~ run ~ membersToWarn:", membersToWarn.map(m => m.displayName));
    for (const member of membersToWarn) {
      try {
        await member.send({ embeds: [verificationWarnEmbedBuilder(member)] });
      } catch (err) {
        return error(
          new TaskError({
            task: this,
            baseError: anyToError(err),
            message: `Unable to send warn message to ${member.displayName} with id ${member.id}`,
          })
        );
      }
    }


    for (const member of membersToKick) {
      if (isUserHaveTicket(ticketChannels, member.id)) continue;
      try {
        await member.send({ embeds: [verificationKickEmbedBuilder()] });
      } catch (err) {
        return error(
          new TaskError({
            task: this,
            baseError: anyToError(err),
            message: `Unable to send kick message to ${member.displayName} with id ${member.id}`,
          })
        );
      }
    }


    return ok(true);
  }

}