import type { CommandRunContext, CommandRunResult } from "arcscord";
import { SubCommand } from "arcscord";

export class AdventScoresSubCommand extends SubCommand {

  subName = "scores";

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.editReply(ctx, {
      content: "success",
    });
  }

}