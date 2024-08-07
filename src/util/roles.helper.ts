import { GuildMember } from 'discord.js';
import { env } from './env';

export const isModerator = (member: GuildMember): boolean => {
  if (member.roles.cache.get(env.MODERATOR_ROLE_ID)) return true;
  else return false;
};
