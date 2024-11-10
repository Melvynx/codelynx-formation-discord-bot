import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.util";

type GetProductQueryType = {
  where: Prisma.ProductWhereUniqueInput;
};

export async function getProductQuery({ where }: GetProductQueryType) {
  const product = await prisma.product.findFirst({
    where,
  });

  return product;
}
