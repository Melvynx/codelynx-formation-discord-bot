import { GuildMember, User } from "discord.js";

/**
 * Format a user mention and username
 * @param memberOrUser Type: GuildMember | User - The member or user to format
 * @returns string formatted with user mention and username
 */
export function displayName(memberOrUser: GuildMember | User): string {
  if (memberOrUser instanceof GuildMember)
    return `<@${memberOrUser.id}>\`${memberOrUser.user.username}\``;
  if (memberOrUser instanceof User)
    return `<@${memberOrUser.id}>\`${memberOrUser.username}\``;

  return "Unknown user";
}
