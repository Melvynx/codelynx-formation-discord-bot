import { ChannelType, type CategoryChildChannel } from "discord.js";

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