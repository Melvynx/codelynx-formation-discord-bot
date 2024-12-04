import { prisma } from "../../prisma.util";

export async function GetAdventChallengeMinimumTimeResponseQuery() {
  return await prisma.adventTicket.findFirst({
    orderBy: {
      timeToResponse: "asc",
    },
    select: {
      timeToResponse: true,
      adventUser: {
        select: {
          discordId: true,

        },
      },
    },
  });
}
