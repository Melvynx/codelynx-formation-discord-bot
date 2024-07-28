import type {
  CommandRunContext, CommandRunResult,
  MessageCommand,
  SlashCommand
} from "arcscord";
import {
  Command
} from "arcscord";
import { searchMessageBuilder, searchSlashBuilder } from "./search.builder";

export class SearchCommand extends Command implements SlashCommand, MessageCommand {

  messageBuilder = searchMessageBuilder;

  name = "search";

  slashBuilder =  searchSlashBuilder;

  run(ctx: CommandRunContext): Promise<CommandRunResult> {

  }

}