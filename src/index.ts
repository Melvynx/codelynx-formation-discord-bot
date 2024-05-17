import { ChannelType, Client, IntentsBitField, ThreadAutoArchiveDuration } from "discord.js";
import { env } from "./util/env";

const parseTitle = (body: string): string => {
  let match = body.match(/<title[^>]*>([^<]*)<\/title>/);
  if (!match || typeof match[1] !== 'string') {
    console.log("don't found title !");
    return "no title found for website"
  }
  return match[1]
}

const client = new Client({intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessages
  ]});

client.on("ready", () => {
  console.log("ready !");
});

client.on("messageCreate", async (message) => {
  try {

    if (message.author.bot) {
      return;
    }

    if (message.guildId !== env.SERVER_ID || message.channelId !== env.LINKS_CHANNEL_ID) {
      return;
    }
    
    if (message.channel.type !== ChannelType.GuildText) {
      console.error("invalid channel");
      return;
    }

    const urlRegex = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/, "g");

    const url = urlRegex.exec(message.content);

    if (!url) {
      const msg = await message.reply(
        "Votre message ne contient pas de lien, merci de répondre dans le fil en question et de supprimer votre message."
      );
    
      setTimeout(async () => {
        try {
          await msg.delete();
    
          const content = message.content;
          await message.author.send(`Ton message a été supprimé. C'était : \n\n ${content}`);
          await message.delete();
        } catch (e) {
          console.error(e);
        }
      }, 60 * 1000);
    
      return;
    }

    const site = await fetch(url[0]);
    let title = parseTitle(await site.text());

    if (title.length >= 99) {
      title = title.slice(0, 96) + "...";
    }

    await message.startThread({
      name: title,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    });

  } catch (e) {
    console.error(e);
  }
});

void client.login(env.TOKEN);