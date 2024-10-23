import type {
  CommandRunContext,
  CommandRunResult,
  InteractionDefaultReplyOptions,
  SlashCommand,
} from "arcscord";
import { verifyBuilder } from "@/commands/verify/verify.builder";
import { getMemberQuery } from "@/utils/prisma/queries/getMember.query";
import {
  Command,
  CommandError,
  error,
} from "arcscord";

export class VerifyCommand extends Command implements SlashCommand {
  slashBuilder = verifyBuilder;

  name = "verify";

  defaultReplyOptions: InteractionDefaultReplyOptions = {
    ephemeral: true,
    preReply: true,
  };

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    const email = ctx.interaction.isChatInputCommand() ? ctx.interaction.options.getString("email") : undefined;
    if (!email) {
      return error(new CommandError({
        message: "No email given",
        command: this,
        context: ctx,
        interaction: ctx.interaction,
      }));
    }

    const member = await getMemberQuery({
      where: { email },
    });
    if (member) {
      return this.editReply(ctx, "Vous êtes déjà vérifé !");
    }
  }
}
