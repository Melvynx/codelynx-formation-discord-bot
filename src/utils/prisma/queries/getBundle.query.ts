import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetBundleQueryType = {
  where: Prisma.BundleWhereUniqueInput;
};

export const GetBundleQuery = async ({ where }: GetBundleQueryType) => {
  const bundle = await prisma.bundle.findFirst({
    where,
    include: {
      products: true,
    },
  });

  return bundle;
};

export type GetBundleQuery = Prisma.PromiseReturnType<typeof GetBundleQuery>;
