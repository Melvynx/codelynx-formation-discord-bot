import { ButtonBuilder, ButtonStyle } from "discord.js";
import { CUSTOM_ID_SEPARATOR } from "arcscord";

export const RENAME_LINK_THREAD_ID = "rename_link_thread";

export const renameLinkThreadBuilder = (id: string): ButtonBuilder => new ButtonBuilder()
  .setCustomId(RENAME_LINK_THREAD_ID + CUSTOM_ID_SEPARATOR + id)
  .setStyle(ButtonStyle.Primary)
  .setLabel("Renommer le fil");