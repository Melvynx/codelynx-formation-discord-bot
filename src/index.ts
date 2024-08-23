import { ArcClient } from "arcscord";
import { SolutionCommand } from "./commands/solution/solution.class";
import { SearchCommand } from "./commands/search/search.class";
import { NewLinkThreadName } from "./components/new_link_thread_name/new_link_thread_name.class";
import { RenameLinkThread } from "./components/rename_link_thread/rename_link_thread.class";
import { AutoTreads } from "./events/auto_threads/auto_threads.class";
import { SolutionCreateThread } from "./events/solution/createThreadSolution.class";
import { env } from "./utils/env/env.util";
import { SearchCommand } from "./commands/search/search.class";
import { DetailedSearchResult } from "./components/detailled_search_result/detailed_search_result.class";
import { AdminCommand } from "./commands/admin/admin.class";
import { EmailInputModal } from "./components/email_input/email_input.class";
import { VerifyButton } from "./components/verify_button/verify.button.class";


const client = new ArcClient(env.TOKEN, {
  intents: [
    "Guilds",
    "MessageContent",
    "GuildMessages",
    "GuildMembers",
    "DirectMessages",
  ],
});

const events = [new AutoTreads(client), new SolutionCreateThread(client)];
void client.eventManager.loadEvents(events);
client.componentManager.loadComponents([
  new NewLinkThreadName(client),
  new RenameLinkThread(client),
  new DetailedSearchResult(client),
  new EmailInputModal(client),
  new VerifyButton(client),
]);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {

  const commands = [
    new SearchCommand(client),
    new SolutionCommand(client),
    new AdminCommand(client),
  ];

  const data = client.commandManager.loadCommands(commands);
  const apisCommands = await client.commandManager.pushGuildCommands(
    env.SERVER_ID,
    data
  );
  client.commandManager.resolveCommands(commands, apisCommands);
});
void client.login();