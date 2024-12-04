import { defaultEmbedBuilder } from "@/utils/embed/defaultEmbed.builder";
import { env } from "@/utils/env/env.util";
import { getAdventMessagesQuery } from "@/utils/prisma/queries/adventChallenge/getAdventMessages.query";
import { UpdateAdventMessageQuery } from "@/utils/prisma/queries/adventChallenge/updateAdventMessageSendDate.query";
import { ok, Task, type TaskResult, type TaskType } from "arcscord";
import { ChannelType, ThreadAutoArchiveDuration } from "discord.js";

export class SendAdventMessageTask extends Task {
  name = "Envoie des messages du challenge de l'avent";

  type: TaskType = "cron";

  interval = "* * * * *";

  async run(): Promise<TaskResult> {
    const pastMessages = await getAdventMessagesQuery({
      where: {
        scheduleTime: {
          lte: new Date(),
        },
        AND: {
          sendTime: {
            equals: null,
          },
        },
      },
      orderBy: {
        scheduleTime: "asc",
      },
    });
    if (!pastMessages.length)
      return ok("No message to send");

    const forumChannel = await this.client.channels.fetch(env.ADVENT_CHALLENGE_CHANNEL_ID);
    if (!forumChannel)
      return ok("Channel not found");

    if (forumChannel.type !== ChannelType.GuildForum)
      return ok("Not a thread channel");

    try {
      for (const message of pastMessages) {
        const embed = defaultEmbedBuilder().setTitle(`Challenge de l'avent - ${message.name}`).setDescription(message.link);

        await forumChannel.threads.create({
          name: message.name,
          message: {
            embeds: [embed],
          },
          autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
          reason: "Advent Challenge of Codeline",
        });

        await UpdateAdventMessageQuery({
          where: {
            id: message.id,
          },
          data: {
            sendTime: new Date(),
          },
        });
      }
    }
    catch (error) {
      console.error("🚀 ~ SendAdventMessageTask ~ run ~ error", error);
    }
    return ok(true);
  }
}
