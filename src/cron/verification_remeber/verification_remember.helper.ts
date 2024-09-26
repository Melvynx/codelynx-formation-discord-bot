import type { GuildMember } from "discord.js";
import { ChannelType, type CategoryChildChannel } from "discord.js";
import type { ArcClient, Result } from "arcscord";
import { ok } from "arcscord";
import { anyToError, BaseError, error } from "arcscord";
import { env } from "@/utils/env/env.util";

/**
 * Check si un utilisateur a crée un ticket via sont ID
 * @param ticketList Liste des channels de tickets
 * @param userId id de l'utilisateur
 * @returns Boolean
 */
export const isUserHaveTicket = (
  ticketList: CategoryChildChannel[],
  userId: string
): boolean => ticketList.some(
  (c: CategoryChildChannel) => c.type === ChannelType.GuildText && c.topic && c.topic.includes(userId)
);

export const getUnverifiedMembers = async(client: ArcClient): Promise<Result<GuildMember[], BaseError>> => {
  let guild, members;
  try {
    guild = await client.guilds.fetch(env.SERVER_ID);
    if (!guild) return error(
      new BaseError({
        message: "Unable to fetch Codeline Guild",
      })
    );
  } catch (e) {
    return error(
      new BaseError({
        message: `Unable to fetch Codeline Guild, error ${anyToError(e).message}`,
        baseError: anyToError(e),
      })
    );
  }


  try {
    members = (await guild.members.fetch()).map(m => m);
  } catch (e) {
    return error(new BaseError({
      message: `Unable to fetch Members, error ${anyToError(e).message},`,
      baseError: anyToError(e),
    }));
  }

  return ok(members.filter(m => !m.roles.cache.has(env.LYNX_ROLE_ID)
    && !m.user.bot
    && m.joinedTimestamp));
};