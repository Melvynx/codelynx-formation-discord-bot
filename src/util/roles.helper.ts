import { GuildMember } from 'discord.js';
import { env } from './env';

export const isModerator = (member: GuildMember): boolean => {
  return member.roles.cache.has(env.MODERATOR_ROLE_ID);
};
