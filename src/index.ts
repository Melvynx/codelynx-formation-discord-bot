import { ArcClient } from "arcscord";
import { env } from "./utils/env/env.util";
import { AutoTreads } from "./events/auto_threads/auto_threads.class";
import { NewLinkThreadName } from "./components/new_link_thread_name/new_link_thread_name.class";
import { RenameLinkThread } from "./components/rename_link_thread/rename_link_thread.class";

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

void client.login();