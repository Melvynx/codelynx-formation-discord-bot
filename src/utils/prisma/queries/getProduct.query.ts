import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetProductQueryType = {
  where: Prisma.ProductWhereUniqueInput;
};

export const GetProductQuery = async ({ where }: GetProductQueryType) => {
  const product = await prisma.product.findFirst({
    where,
  });

  return product;
};

export type GetProductQuery = Prisma.PromiseReturnType<typeof GetProductQuery>;
