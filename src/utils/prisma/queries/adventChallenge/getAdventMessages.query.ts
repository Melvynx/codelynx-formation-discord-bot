import type { Prisma } from "@prisma/client";
import { prisma } from "../../prisma.util";

export async function getAdventMessagesQuery(args: Prisma.AdventMessageFindManyArgs) {
  const adventMessages = await prisma.adventMessage.findMany(args);

  return adventMessages;
}
