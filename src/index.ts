import { ChannelType, Client, IntentsBitField, ThreadAutoArchiveDuration } from "discord.js";
import { env } from "./util/env";

const parseTitle = (body: string): string => {
  let match = body.match(/<title>([^<]*)<\/title>/);
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
      const msg = await message.reply("Votre message ne contient pas de lien, merci de répondre dans le fil en question !" +
        " et de supprimer votre message s'il n'a rien à faire ici !");
      setTimeout(() => {
        void msg.delete();
      }, 60 * 1000)

     return;
    }

    const site = await fetch(url[0]);
    const title = parseTitle(await site.text());

    await message.channel.threads.create({
      name: title,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      type: ChannelType.PublicThread,
      invitable: true,
    });

  } catch (e) {
    console.error(e);
  }
});

void client.login(env.TOKEN);