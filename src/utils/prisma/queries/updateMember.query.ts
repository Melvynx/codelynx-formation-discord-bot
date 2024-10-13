import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type UpdateMemberQueryType = {
  where: Prisma.MemberWhereUniqueInput;
  data: Prisma.MemberUpdateInput;
};

export const UpdateMemberQuery = async ({ data, where }: UpdateMemberQueryType) => {
  const user = await prisma.member.update({
    where,
    data,
  });
};

export type UpdateMemberQuery = NonNullable<
  Prisma.PromiseReturnType<typeof UpdateMemberQuery>
>;
