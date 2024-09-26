import { getTicketsChannels } from "@/utils/chanels/chanels.utils";
import { env } from "@/utils/env/env.util";
import type { TaskResult, TaskType } from "arcscord";
import { defaultLogger, error, ok, Task, TaskError } from "arcscord";
import { subDays } from "date-fns";
import { verificationKickEmbedBuilder } from "./kick_embed.builder";
import { getUnverifiedMembers, isUserHaveTicket } from "./verification_remember.helper";
import { verificationWarnEmbedBuilder } from "./warn_embed.builder";

export class VerificationRememberTask extends Task {

  name = "Rappel de vérification";

  type: TaskType = "cron";

  interval = "0 0 7 * * *";

  async run(): Promise<TaskResult> {
    const ticketChannels = await getTicketsChannels(
      this.client
    );
    if (!ticketChannels) return error(
      new TaskError({
        message: "Unable to fetch ticketChannels",
        task: this,
      })
    );

    const [usersWithoutLynxRole, err] = await getUnverifiedMembers(this.client);

    if (err) {
      return error(
        new TaskError({
          message: "Unable to fetch unverified members",
          baseError: err,
          task: this,
        })
      );
    }
    const membersToKick = usersWithoutLynxRole.filter(
      m => m.joinedTimestamp!
        < subDays(new Date(), Number(env.DAY_TO_KICK)).getTime()
    );
    const membersToWarn = usersWithoutLynxRole.filter(m => !membersToKick.includes(m) && m.joinedTimestamp!
      < subDays(new Date(), Number(env.DAY_TO_WARN)).getTime());

    for (const member of membersToWarn) {
      try {
        await member.send({ embeds: [verificationWarnEmbedBuilder(member)] });
      } catch (err) {
        defaultLogger.warning(
          `Unable to send warn message to ${member.user.username} with id ${member.id}`
        );
      }
    }


    for (const member of membersToKick) {
      if (isUserHaveTicket(ticketChannels, member.id)) continue;
      try {
        await member.send({ embeds: [verificationKickEmbedBuilder()] });
      } catch (err) {
        defaultLogger.warning(
          `Unable to send kick message to ${member.user.username} with id ${member.id}`
        );
      }
      try {
        await member.kick();
      } catch (err) {
        defaultLogger.warning(
          `Unable to kick ${member.user.username} with id ${member.id}`
        );
      }
    }


    return ok(true);
  }

}