import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type UpdateMemberQueryType = Prisma.MemberUpsertArgs;

export async function updateMemberQuery({
  create,
  update,
  where,
}: UpdateMemberQueryType) {
  await prisma.member.upsert({
    where,
    update,
    create,
  });
}
