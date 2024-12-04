import type { Prisma } from "@prisma/client";
import { prisma } from "../../prisma.util";

export async function UpdateAdventMessageQuery(args: Prisma.AdventMessageUpdateArgs) {
  const adventMessages = await prisma.adventMessage.update(args);

  return adventMessages;
}
