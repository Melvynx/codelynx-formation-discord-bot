import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type UpdateMemberQueryType = Prisma.MemberUpsertArgs;

export const UpdateMemberQuery = async ({
  create,
  update,
  where,
}: UpdateMemberQueryType) => {
  await prisma.member.upsert({
    where,
    update,
    create,
  });
};

export type UpdateMemberQuery = NonNullable<
  Prisma.PromiseReturnType<typeof UpdateMemberQuery>
>;
