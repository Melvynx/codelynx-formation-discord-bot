import type { CommandRunContext, CommandRunResult } from "arcscord";
import { defaultEmbedBuilder } from "@/utils/embed/defaultEmbed.builder";
import { displayName } from "@/utils/format/formatUser";
import { getAdventChallengeWinnersQuery } from "@/utils/prisma/queries/adventChallenge/getAdventChallengeWinners.query";
import { SubCommand } from "arcscord";

export class AdventScoresSubCommand extends SubCommand {
  subName = "scores";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const scores = await getAdventChallengeWinnersQuery();

    const embed = defaultEmbedBuilder().setTitle("Advent Challenge Scores");

    let desc = "";
    for (const score of scores) {
      const user = await this.client.users.fetch(score.discordId);
      desc += `${displayName(user)}: ${score._count.tickets} 🎟️\n`;
    }
    embed.setDescription(desc);

    return this.editReply(ctx, {
      embeds: [embed],
    });
  }
}
