import { getBundlesQuery } from "../../prisma/queries/getBundleQuery";
import { getProductsQuery } from "../../prisma/queries/getProduct.query";
import { getCodelineRoleIdsForProducts } from "./codeline.role-mapping";

export type CodelineRoleState = {
  desiredRoleIds: string[];
  additionalManagedRoleIds: string[];
};

export async function resolveCodelineRoleState(
  entitlementIds: readonly string[],
): Promise<CodelineRoleState> {
  const [products, bundles] = await Promise.all([
    getProductsQuery(),
    getBundlesQuery(),
  ]);
  const entitlementIdSet = new Set(entitlementIds);
  const productRoleIds = products
    .filter(product => entitlementIdSet.has(product.id))
    .map(product => product.discordRoleId);
  const bundleRoleIds = bundles
    .filter(bundle => entitlementIdSet.has(bundle.id))
    .flatMap(bundle => bundle.products.map(product => product.discordRoleId));

  return {
    desiredRoleIds: [...new Set([
      ...getCodelineRoleIdsForProducts(entitlementIds),
      ...productRoleIds,
      ...bundleRoleIds,
    ])],
    additionalManagedRoleIds: [...new Set([
      ...products.map(product => product.discordRoleId),
      ...bundles.flatMap(bundle => bundle.products.map(product => product.discordRoleId)),
    ])],
  };
}
