import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type CreateNewMemberQueryType = {
  data: Prisma.MemberCreateInput;
};

export const CreateNewMemberQuery = async ({ data }: CreateNewMemberQueryType) => {
  const user = await prisma.member.create({
    data,
  });

  return user;
};

export type CreateNewMemberQuery = NonNullable<
  Prisma.PromiseReturnType<typeof CreateNewMemberQuery>
>;
