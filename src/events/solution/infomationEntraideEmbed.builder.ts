import { env } from "@/utils/env/env.util";
import { EmbedBuilder } from "discord.js";

export function informationEntraideEmbedBuilder(threadId: string) {
  return new EmbedBuilder()
    .setTitle("Un nouveau post d'entraide a été créé")
    .setURL(`https://discord.com/channels/${env.SERVER_ID}/${threadId}`)
    .setDescription(`N'hésitez pas à y jeter un œil: <#${threadId}>`)
    .setColor("#00b0f4")
    .setFooter({
      text: "Codelynx Bot",
    })
    .setTimestamp();
}
