import type { User } from "../api/codeline/codeline.type";
import type { Product } from "./webhook.type";
import { client } from "@/index";
import { anyToError, defaultLogger } from "arcscord";
import {
  getCodelineRoleDelta,
  getCodelineRoleIds,
} from "../api/codeline/codeline.role-mapping";
import { resolveCodelineRoleState } from "../api/codeline/codeline.role-state";
import { getUser } from "../api/codeline/codeline.util";
import { env } from "../env/env.util";
import { displayName } from "../format/formatUser";
import { LynxLogger } from "../log/log.util";
import { getBundleQuery } from "../prisma/queries/getBundleQuery";
import { getProductQuery } from "../prisma/queries/getProduct.query";
import { updateMemberQuery } from "../prisma/queries/updateMember.query";

function isUnknownMemberError(error: unknown): boolean {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && error.code === 10007;
}

async function getValidatedCodelineUser(
  webhookProduct: Product,
): Promise<NonNullable<User["user"]>> {
  const [codelineUser, codelineUserError] = await getUser(webhookProduct.email);
  if (codelineUserError)
    throw codelineUserError;

  if (!codelineUser)
    throw new Error(`Codeline user "${webhookProduct.email}" not found`);

  if (
    webhookProduct.userDiscordId
    && codelineUser.discordId
    && webhookProduct.userDiscordId !== codelineUser.discordId
  ) {
    throw new Error(
      `Discord ID mismatch for Codeline user "${webhookProduct.email}"`,
    );
  }

  return codelineUser;
}

async function synchronizeCodelineRoles(
  webhookProduct: Product,
  codelineUser: NonNullable<User["user"]>,
  eventRoleIds: readonly string[],
  removeStaleRoles: boolean,
): Promise<void> {
  const discordId = webhookProduct.userDiscordId ?? codelineUser.discordId;
  if (!discordId)
    return;

  const guild = client.guilds.cache.get(env.SERVER_ID);
  if (!guild)
    throw new Error("Guild not found");

  let member;
  try {
    member = await guild.members.fetch(discordId);
  }
  catch (error) {
    if (isUnknownMemberError(error))
      return;
    throw error;
  }

  const currentEntitlementIds = codelineUser.products.map(product => product.id);
  const {
    desiredRoleIds: currentDesiredRoleIds,
    additionalManagedRoleIds,
  } = await resolveCodelineRoleState(currentEntitlementIds);
  const desiredRoleIds = [
    ...new Set(removeStaleRoles
      ? currentDesiredRoleIds
      : [...currentDesiredRoleIds, ...eventRoleIds]),
  ];
  const { roleIdsToAdd, roleIdsToRemove } = getCodelineRoleDelta(
    member.roles.cache.keys(),
    desiredRoleIds,
    additionalManagedRoleIds,
  );

  for (const roleId of roleIdsToAdd)
    await member.roles.add(roleId);
  if (removeStaleRoles) {
    for (const roleId of roleIdsToRemove)
      await member.roles.remove(roleId);
  }

  const addedRoles = roleIdsToAdd.map(roleId => `<@&${roleId}>`).join(" ,");
  const removedRoles = removeStaleRoles
    ? roleIdsToRemove.map(roleId => `<@&${roleId}>`).join(" ,")
    : "";
  LynxLogger.info(
    `Codeline roles synchronized for ${displayName(member)}: added ${addedRoles || "none"}, removed ${removedRoles || "none"}`,
  );
}

export async function onProductPurchaseAsync(webhookProduct: Product) {
  const codelineUser = await getValidatedCodelineUser(webhookProduct);
  const product = await getProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });
  let bundle;
  if (!product) {
    bundle = await getBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });
  }

  if (bundle) {
    try {
      await updateMemberQuery({
        where: { id: webhookProduct.userId },
        update: {
          discordUserId: webhookProduct.userDiscordId,
          bundles: {
            connect: {
              id: bundle.id,
            },
          },
        },
        create: {
          id: webhookProduct.userId,
          email: webhookProduct.email,
          discordUserId: webhookProduct.userDiscordId,
          bundles: {
            connect: {
              id: bundle.id,
            },
          },
        },
      });
    }
    catch (error) {
      defaultLogger.warning(
        `Failed to add bundle ${anyToError(error).message} to member ${
          webhookProduct.userId
        } in database`,
      );
    }
  }

  if (product) {
    try {
      await updateMemberQuery({
        where: {
          id: webhookProduct.userId,
        },
        create: {
          id: webhookProduct.userId,
          email: webhookProduct.email,
          discordUserId: webhookProduct.userDiscordId,
          products: {
            connect: {
              id: product.id,
            },
          },
        },
        update: {
          discordUserId: webhookProduct.userDiscordId,
          products: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }
    catch (error) {
      defaultLogger.warning(
        `Failed to add product ${anyToError(error).message} to member ${
          webhookProduct.userId
        } in database`,
      );
    }
  }

  const eventRoleIds = [
    ...getCodelineRoleIds(webhookProduct.itemId),
    ...(product
      ? [product.discordRoleId]
      : bundle?.products.map(product => product.discordRoleId) ?? []),
  ];
  await synchronizeCodelineRoles(webhookProduct, codelineUser, eventRoleIds, false);
}

export async function onProductRefundAsync(webhookProduct: Product) {
  const codelineUser = await getValidatedCodelineUser(webhookProduct);
  const product = await getProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });

  let bundle;
  if (!product) {
    bundle = await getBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });
  }
  if (bundle) {
    try {
      await updateMemberQuery({
        where: { id: webhookProduct.userId },
        update: {
          discordUserId: webhookProduct.userDiscordId,
          bundles: {
            disconnect: {
              id: bundle.id,
            },
          },
        },
        create: {
          id: webhookProduct.userId,
          email: webhookProduct.email,
          discordUserId: webhookProduct.userDiscordId,
        },
      });
    }
    catch (error) {
      defaultLogger.warning(
        `Failed to remove bundle ${anyToError(error).message} to member ${
          webhookProduct.userId
        } in database`,
      );
    }
  }

  if (product) {
    try {
      await updateMemberQuery({
        where: { id: webhookProduct.userId },
        update: {
          discordUserId: webhookProduct.userDiscordId,
          products: {
            disconnect: {
              id: product.id,
            },
          },
        },
        create: {
          id: webhookProduct.userId,
          email: webhookProduct.email,
          discordUserId: webhookProduct.userDiscordId,
        },
      });
    }
    catch (error) {
      defaultLogger.warning(
        `Failed to remove product ${anyToError(error).message} to member ${
          webhookProduct.userId
        } in database`,
      );
    }
  }

  await synchronizeCodelineRoles(webhookProduct, codelineUser, [], true);
}
