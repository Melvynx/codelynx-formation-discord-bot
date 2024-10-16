import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetMemberQueryProps = {
  where: Prisma.MemberWhereUniqueInput;
};

export const GetMemberQuery = async ({ where }: GetMemberQueryProps) => {
  const member = await prisma.member.findUnique({
    where,
    include: {
      products: true,
      bundle: {
        include: {
          products: true,
        },
      },
    },
  });

  return member;
};

export type GetMemberQuery = Prisma.PromiseReturnType<typeof GetMemberQuery>;
