import { z } from "zod";
import { prisma } from "../../prisma.util";

const _AdventChallengeAddTicketQuerySchema = z.object({
  discordId: z.string(),
  messageId: z.string(),
  timeToResponse: z.number(),
});

type AdventChallengeAddTicketQueryProps = z.input<typeof _AdventChallengeAddTicketQuerySchema>;

export async function AdventChallengeAddTicketQuery({ discordId, messageId, timeToResponse }: AdventChallengeAddTicketQueryProps) {
  return await prisma.adventTicket.create({
    data: {
      messageId,
      dateTime: new Date(),
      timeToResponse,

      adventUser: {
        connectOrCreate: {
          where: {
            discordId,
          },
          create: {
            discordId,
          },
        },
      },
    },
  });
}
