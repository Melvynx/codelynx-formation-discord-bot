import { env } from "@/utils/env/env.util";
import type { EventHandleResult } from "arcscord";
import { Event } from "arcscord";
import { ChannelType, EmbedBuilder, type AnyThreadChannel } from "discord.js";

export class SolutionCreateThread extends Event<"threadCreate"> {
  event = "threadCreate" as const;

  name = "SolutionCreateThread";

  async handle(
    thread: AnyThreadChannel<boolean>,
    newlyCreated: boolean,
  ): EventHandleResult | Promise<EventHandleResult> {
    if (
      thread.parentId != env.HELP_CHANNEL_ID ||
      thread.type != ChannelType.PublicThread ||
      !newlyCreated
    )
      return ok(true);

    const embed = new EmbedBuilder()
      .setTitle("Post crée !")
      .setDescription(
        ":white_check_mark: Une fois le post résolu, vous pouvez marquer le message qui vous a aidé avec : `clic droit -> Applications -> Marquer comme solution.`",
      )
      .setColor("#5865f2");

    await thread.send({ embeds: [embed] });

    return ok("Solution information message send");
  }
}
