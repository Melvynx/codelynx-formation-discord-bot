import { ArcClient } from "arcscord";
import { env } from "./utils/env/env.util";
import { AutoTreads } from "./events/auto_threads/auto_threads.class";
import { NewLinkThreadName } from "./components/new_link_thread_name/new_link_thread_name.class";
import { RenameLinkThread } from "./components/rename_link_thread/rename_link_thread.class";
import { searchX } from "./utils/search/x/x.util";
import { SearchCommand } from "./commands/search/search.class";

const client = new ArcClient(env.TOKEN, {
  intents: [
    "Guilds",
    "MessageContent",
    "GuildMessages",
    "GuildMembers",
    "DirectMessages",
  ],
});

void client.eventManager.loadEvent(new AutoTreads(client));
client.componentManager.loadComponents([
  new NewLinkThreadName(client),
  new RenameLinkThread(client),
]);
client.on("ready", async() => {
  const commands = [new SearchCommand(client)];
  const data = client.commandManager.loadCommands(commands);
  const apisCommands = await client.commandManager.pushGuildCommands(env.SERVER_ID, data);
  client.commandManager.resolveCommands(commands, apisCommands);

});
void client.login();