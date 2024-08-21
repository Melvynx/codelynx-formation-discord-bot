import { env } from '@/utils/env/env.util';
import { GuildMember } from 'discord.js';

export const isModerator = (member: GuildMember): boolean => {
  return member.roles.cache.has(env.MODERATOR_ROLE_ID);
};
