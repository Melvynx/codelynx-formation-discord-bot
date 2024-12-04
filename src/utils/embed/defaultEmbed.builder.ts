import { EmbedBuilder } from "discord.js";
import { env } from "../env/env.util";

export function defaultEmbedBuilder() {
  return new EmbedBuilder()
    .setAuthor({
      name: "CodeLynx",
      iconURL: env.ICON_URL,
    })
    .setFooter({
      text: "CodeLynx",
      iconURL: env.ICON_URL,
    })
    .setColor("Green")
    .setTimestamp();
}
