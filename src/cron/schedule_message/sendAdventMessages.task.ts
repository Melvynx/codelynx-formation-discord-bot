import { env } from "@/utils/env/env.util";
import { prisma } from "@/utils/prisma/prisma.util";
import { getAdventMessagesQuery } from "@/utils/prisma/queries/adventChallenge/getAdventMessages.query";
import { UpdateAdventMessageQuery } from "@/utils/prisma/queries/adventChallenge/updateAdventMessageSendDate.query";
import { ok, Task, type TaskResult, type TaskType } from "arcscord";
import { ChannelType, GuildForumThreadManager, ThreadAutoArchiveDuration } from "discord.js";

export class SendAdventMessageTask extends Task {
  name = "Envoie des messages du challenge de l'avent";

  type: TaskType = "cron";

  interval = "*/5 * * * * *";

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
    console.log("🚀 ~ SendAdventMessageTask ~ run ~ pastMessages:", pastMessages);
    if (!pastMessages.length)
      return ok("No message to send");

    const forumChannel = await this.client.channels.fetch(env.ADVENT_CHALLENGE_CHANNEL_ID);
    if (!forumChannel)
      return ok("Channel not found");

    if (forumChannel.type !== ChannelType.GuildForum)
      return ok("Not a thread channel");

    try {
      for (const message of pastMessages) {
        await forumChannel.threads.create({
          name: message.name,
          message: {
            content: message.link,
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

    console.log("🚀 ~ SendAdventMessageTask ~ run ~ pastMessages:", pastMessages);
    return ok(true);
  }
}
