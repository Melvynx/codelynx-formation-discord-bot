import type { tombolaEmbedProps } from "@/components/advent/tombolaEmbedProps.type";
import type { CommandRunContext, CommandRunResult } from "arcscord";
import type { adventScores } from "../scores/scores.type";
import { adventResultEmbedBuilder } from "@/components/advent/tombola_embed.builder";
import { LynxLogger } from "@/utils/log/log.util";
import { GetAdventChallengeMinimumTimeResponseQuery } from "@/utils/prisma/queries/adventChallenge/getAdventChallengeMinimumTimeResponse.query";
import { getAdventChallengeWinnersQuery } from "@/utils/prisma/queries/adventChallenge/getAdventChallengeWinners.query";
import { SubCommand } from "arcscord";
import { isBefore } from "date-fns";

export class AdventTombolaSubCommand extends SubCommand {
  subName = "tombola";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const noelDate = new Date("2024-12-25");
    if (isBefore(new Date(), noelDate)) {
      LynxLogger.warn(`${ctx.interaction.user.username} try to use the advent tombola before the 25 December`);
      return this.editReply(ctx, {
        content: "Error you cannot use this command before 25 December",
      });
    }

    const scores = await getAdventChallengeWinnersQuery();

    const allTickets: adventScores = scores.flatMap(s => Array.from({ length: s._count.tickets }, (_, idx) => ({
      userId: s.discordId,
      ticketCount: idx,
    })));

    const winners: adventScores = [];
    while (winners.length < 3 && allTickets.length > 0) {
      const randomIndex = Math.floor(Math.random() * allTickets.length);

      winners.push(allTickets[randomIndex]);
      allTickets.splice(randomIndex, 1);
    }

    const userMoreTicket = scores.reduce((prev, current) => {
      return prev._count.tickets > current._count.tickets ? prev : current;
    });
    const userMoreMessage = scores.reduce((prev, current) => {
      return prev.messageCount > current.messageCount ? prev : current;
    });

    const userQuickTime = await GetAdventChallengeMinimumTimeResponseQuery();
    if (!userQuickTime || !userQuickTime.adventUser || !userQuickTime.adventUser.discordId) {
      LynxLogger.warn("AdventTombolaSubCommand => No user found with the minimum time to response");
      return this.editReply(ctx, {
        content: "Error no user found with the minimum time to response",
      });
    }

    const tombolaResultData: tombolaEmbedProps = {
      participants: scores.map(u => ({ userId: u.discordId, ticketCount: u._count.tickets })),
      moreTicket: {
        userId: userMoreTicket.discordId,
        ticketCount: userMoreTicket._count.tickets,
      },
      moreMessage: {
        userId: userMoreMessage.discordId,
        messageCount: userMoreMessage.messageCount,
      },
      quickTime: {
        userId: userQuickTime.adventUser.discordId,
        responseTime: userQuickTime.timeToResponse,
      },
      firstReward: winners[0],
      secondReward: winners[1],
      thirdReward: winners[2],
    };

    return this.editReply(ctx, {
      embeds: [adventResultEmbedBuilder(tombolaResultData)],
      content: "success",
    });
  }
}
