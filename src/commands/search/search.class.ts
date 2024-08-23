import type { CommandRunContext, CommandRunResult, MessageCommand, SlashCommand } from "arcscord";
import { Command, CommandError, error } from "arcscord";
import { searchMessageBuilder, searchSlashBuilder } from "./search.builder";
import type { SearchResult } from "@/utils/search/search.type";
import { search } from "@/utils/search/search.util";
import type { ButtonBuilder } from "discord.js";
import { ActionRowBuilder, EmbedBuilder } from "discord.js";
import { detailedSearchResultBuilder } from "@/components/detailled_search_result/detailed_search_result.builder";

export class SearchCommand extends Command implements SlashCommand, MessageCommand {

  messageBuilder = searchMessageBuilder;

  name = "search";

  slashBuilder =  searchSlashBuilder;

  defaultReplyOptions = {
    ephemeral: false,
    preReply: true,
  };

  async run(ctx: CommandRunContext): Promise<CommandRunResult> {
    let result: SearchResult;
    if (ctx.interaction.isMessageContextMenuCommand()) {
      const content = ctx.interaction.targetMessage.content;
      const [result2, err] = await search(content, true);
      if (err !== null || result2 === null) {
        return error(new CommandError({
          message: "failed to search",
          command: this,
          context: ctx,
          interaction: ctx.interaction,
          baseError: err,
        }));
      }
      result = result2;

    } else if (ctx.interaction.isChatInputCommand()) {

      const query = ctx.interaction.options.getString("query", false) || "nothing";
      const [result2, err] = await search(query);
      if (err !== null || result2 === null) {
        return error(new CommandError({
          message: "failed to search",
          command: this,
          context: ctx,
          interaction: ctx.interaction,
          baseError: err,
        }));
      }
      result = result2;
    } else {
      return error(new CommandError({
        message: "invalid type",
        command: this,
        context: ctx,
        interaction: ctx.interaction,
      }));
    }

    if (result.xPosts.length < 1) {
      return this.editReply(ctx, "Pas de résultats");
    }

    const embed = new EmbedBuilder()
      .setTitle("Résultat de la recherche")
      .setColor("Green")
      .setDescription(`**X :** [${result.xPosts[0].title}](${result.xPosts[0].url})`
      + (result.youtubeVideos.length > 0 ? `\n**Youtube :** [${result.youtubeVideos[0].title}](${result.youtubeVideos[0].url})` : ""))
      .setFooter({
        text: "Pour optenir un résultat détailler, cliquer sur le bouton en dessous !",
      })
      .setImage(result.youtubeVideos[0]?.media || null);

    return this.editReply(ctx, {
      embeds: [embed],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(detailedSearchResultBuilder(result.id))],
    });
  }

}