import type { Event } from "arcscord";
import type { ClientEvents } from "discord.js";
import { UnverifiedMemberListCommand } from "@/commands/unverified_member_list/unverified_member_list.class";
import { ArcClient } from "arcscord";
import { AdminCommand } from "./commands/admin/admin.class";
import { AdventCommand } from "./commands/advent_challenge/advent_challenge.class";
import { PingCommand } from "./commands/ping/ping.class";
import { SearchCommand } from "./commands/search/search.class";
import { SolutionCommand } from "./commands/solution/solution.class";
import { DetailedSearchResult } from "./components/detailled_search_result/detailed_search_result.class";
import { NewLinkThreadName } from "./components/new_link_thread_name/new_link_thread_name.class";
import { RenameLinkThread } from "./components/rename_link_thread/rename_link_thread.class";
import { VerificationModal } from "./components/verification_modal/verification_modal.class";
import { VerifyButton } from "./components/verify_button/verify.button.class";
import { SendAdventMessageTask } from "./cron/schedule_message/sendAdventMessages.task";
import { VerificationRememberTask } from "./cron/verification_remeber/verification_remember.task";
import { AdventMessageCreate } from "./events/advent_calendar/adventMessageCreate.class";
import { AdventMessageUpdate } from "./events/advent_calendar/adventMessageUpdate.class";
import { AutoTreads } from "./events/auto_threads/auto_threads.class";
import { ClosedTicketLimit } from "./events/closedTicketLimit/closedTicketLimit.class";
import { SolutionCreateThread } from "./events/solution/create_thread_solution.class";
import { env } from "./utils/env/env.util";
import { startWebhookServer } from "./utils/webhook/server";

export const client = new ArcClient(env.TOKEN, {
  intents: [
    "Guilds",
    "MessageContent",
    "GuildMessages",
    "GuildMembers",
    "DirectMessages",
  ],
});
const events = [
  new AutoTreads(client),
  new SolutionCreateThread(client),
  new ClosedTicketLimit(client),
  new AdventMessageCreate(client),
  new AdventMessageUpdate(client),
];

void client.eventManager.loadEvents(events as Event<keyof ClientEvents>[]);
client.componentManager.loadComponents([
  new NewLinkThreadName(client),
  new RenameLinkThread(client),
  new DetailedSearchResult(client),
  new VerificationModal(client),
  new VerifyButton(client),
]);

client.on("ready", async () => {
  const commands = [
    new SearchCommand(client),
    new SolutionCommand(client),
    new AdminCommand(client),
    new AdventCommand(client),
    new UnverifiedMemberListCommand(client),
    new PingCommand(client),
  ];

  const data = client.commandManager.loadCommands(commands);
  const apisCommands = await client.commandManager.pushGuildCommands(
    env.SERVER_ID,
    data,
  );
  client.commandManager.resolveCommands(commands, apisCommands);

  client.taskManager.loadTasks([new VerificationRememberTask(client), new SendAdventMessageTask(client)]);
});

void startWebhookServer();

void client.login();
