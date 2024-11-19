import type {
  ArcClient,
  CommandRunContext,
  CommandRunResult,
  InteractionDefaultReplyOptions,
  SlashCmdBuilder,
  SlashCommandWithSubs,
  SubSlashCommandList,
} from "arcscord";
import { Command } from "arcscord";
import { adventCommandBuilder } from "./advent_challenge.builder";
import { AdventScoresSubCommand } from "./scores/scores.class";
import { AdventTombolaSubCommand } from "./tombola/tombola.class";

export class AdventCommand extends Command implements SlashCommandWithSubs {
  name = "advent";

  slashBuilder = adventCommandBuilder as SlashCmdBuilder;

  subsCommands: SubSlashCommandList = {};

  defaultReplyOptions: InteractionDefaultReplyOptions = {
    preReply: true,
    ephemeral: true,
  };

  constructor(client: ArcClient) {
    super(client);

    this.subsCommands = {
      scores: new AdventScoresSubCommand(this.client, this),
      tombola: new AdventTombolaSubCommand(this.client, this),
    };
  }

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.handleSubCommands(ctx);
  }
}
