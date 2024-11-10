import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetMemberQueryProps = {
  where: Prisma.MemberWhereUniqueInput;
};

export async function getMemberQuery({ where }: GetMemberQueryProps) {
  const member = await prisma.member.findUnique({
    where,
    include: {
      products: true,
      bundles: {
        include: {
          products: true,
        },
      },
    },
  });

  return member;
}
