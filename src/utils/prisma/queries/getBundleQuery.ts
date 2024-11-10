import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetBundleQueryType = {
  where: Prisma.BundleWhereUniqueInput;
};

export async function getBundleQuery({ where }: GetBundleQueryType) {
  const bundle = await prisma.bundle.findFirst({
    where,
    include: {
      products: true,
    },
  });

  return bundle;
}
