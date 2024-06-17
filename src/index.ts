import { Client, IntentsBitField, Partials } from "discord.js";
import { askNewUserEmailModule } from "./modules/ask-new-user-email";
import { createLinkOnlyChannel } from "./modules/link-only-channel";
import { env } from "./util/env";

const client = new Client({
  partials: [Partials.Channel, Partials.Message],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildModeration,
  ],
});

client.on("ready", () => {
  console.log("ready !");
});

createLinkOnlyChannel(client);
askNewUserEmailModule(client);

void client.login(env.TOKEN);
