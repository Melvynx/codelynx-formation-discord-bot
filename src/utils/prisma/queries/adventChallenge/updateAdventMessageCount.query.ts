import { prisma } from "../../prisma.util";

export async function updateAdventMessageCountQuery(discordId: string) {
  return await prisma.adventUser.upsert({
    where: {
      discordId,
    },
    create: {
      discordId,
      messageCount: 1,
    },
    update: {
      messageCount: {
        increment: 1,
      },
    },
  });
}
