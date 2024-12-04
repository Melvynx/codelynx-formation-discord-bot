import { prisma } from "../../prisma.util";

export async function getAdventChallengeWinnersQuery() {
  return await prisma.adventUser.findMany({
    include: {
      tickets: true,
      _count: {
        select: {
          tickets: true,
        },
      },
    },
  });
}
