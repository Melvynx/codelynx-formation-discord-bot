import type { CommandRunContext, CommandRunResult, SlashCommand } from "arcscord";
import { displayName } from "@/utils/format/formatUser";
import { LynxLogger } from "@/utils/log/log.util";
import { Command } from "arcscord";
import { pingSlashBuilder } from "./ping.builder";

export class PingCommand extends Command implements SlashCommand {
  name = "ping";

  slashBuilder = pingSlashBuilder;

  defaultReplyOptions = {
    ephemeral: true,
    preReply: true,
  };

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    LynxLogger.info(`Ping command executed by ${displayName(ctx.interaction.user)}`);

    return this.editReply(ctx, "Pong 🏓");
  }
}
