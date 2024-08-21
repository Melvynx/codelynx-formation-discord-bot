import type {
  ArcClient,
  CommandRunContext,
  CommandRunResult, SlashCmdBuilder,
  SlashCommandWithSubs,
  SubSlashCommandList
} from "arcscord";
import { Command } from "arcscord";
import { adminCommandBuilder } from "./admin.builder";
import { SetupVerifySubCommand } from "./setup/verify.class";

export class AdminCommand extends Command implements SlashCommandWithSubs {

  name = "admin";

  slashBuilder = adminCommandBuilder as SlashCmdBuilder;

  subsCommands: SubSlashCommandList = {};

  constructor(client: ArcClient) {
    super(client);

    this.subsCommands = {
      setup: {
        verify: new SetupVerifySubCommand(this.client, this),
      },
    };
  }

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.handleSubCommands(ctx);
  }

}