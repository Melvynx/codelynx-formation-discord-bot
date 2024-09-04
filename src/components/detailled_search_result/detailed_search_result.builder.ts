import { ButtonBuilder, ButtonStyle } from "discord.js";
import { CUSTOM_ID_SEPARATOR } from "arcscord";

export const DETAILED_SEARCH_RESULT_ID = "detailed_search_result";

export const detailedSearchResultBuilder = (id: string): ButtonBuilder => new ButtonBuilder()
  .setCustomId(DETAILED_SEARCH_RESULT_ID + CUSTOM_ID_SEPARATOR + id)
  .setStyle(ButtonStyle.Success)
  .setLabel("Détaillé");