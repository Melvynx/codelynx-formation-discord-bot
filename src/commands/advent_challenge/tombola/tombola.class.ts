import { adventResultEmbedBuilder } from "@/components/advent/tombola_embed.builder";
import type { tombolaEmbedPropsSchema } from "@/components/advent/tombolaEmbedProps.type";
import type { CommandRunContext, CommandRunResult } from "arcscord";
import { SubCommand } from "arcscord";
import type { adventScoresSchema } from "../scores/scores.type";

export class AdventTombolaSubCommand extends SubCommand {

  subName = "tombola";


  async run(ctx: CommandRunContext): Promise<CommandRunResult> {

    // const noelDate = new Date("2024-12-25");
    // if (isBefore(new Date(), noelDate)) {
    //   defaultLogger.warning(`${ctx.interaction.user.username} try to use the advent tombola before the 25 December`);
    //   return this.editReply(ctx, {
    //     content: "Error you cannot use this command before 25 December",
    //   });
    // }

    const scores: adventScoresSchema = [
      { userId: "457144873859022858", ticketCount: 5 },
      { userId: "152125692618735616", ticketCount: 10 },
      { userId: "826527359141675019", ticketCount: 3 },
      { userId: "720046808679841803", ticketCount: 7 },
    ];

    const allTickets: adventScoresSchema = scores.flatMap(s => Array.from({ length: s.ticketCount }, (_, idx) => ({
      userId: s.userId,
      ticketCount: idx,
    })));


    const winners: adventScoresSchema = [];
    while (winners.length < 3 && allTickets.length > 0) {
      const randomIndex = Math.floor(Math.random() * allTickets.length);

      winners.push(allTickets[randomIndex]);
      allTickets.splice(randomIndex, 1);
    }

    const tombolaResultData: tombolaEmbedPropsSchema = {
      participants: scores,
      moreTicket: scores.reduce((prev, current) => {
        return prev.ticketCount > current.ticketCount ? prev : current;
      }),
      moreMessage: {
        userId: scores[0].userId,
        messageCount: 186,
      },
      quickTime: {
        userId: scores[3].userId,
        responseTime: 1500,
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