import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type UpdateMemberQueryType = Prisma.MemberUpsertArgs;

export function updateMemberQuery({
  create,
  update,
  where,
}: UpdateMemberQueryType) {
  return prisma.member.upsert({
    where,
    update,
    create,
    include: {
      products: true,
      bundles: {
        include: {
          products: true,
        },
      },
    },
  });
}
