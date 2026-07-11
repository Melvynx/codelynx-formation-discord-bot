import type { Product } from "./webhook.type";
import { client } from "@/index";
import { anyToError, defaultLogger } from "arcscord";
import { getCodelineRoleIds } from "../api/codeline/codeline.role-mapping";
import { getUser } from "../api/codeline/codeline.util";
import { env } from "../env/env.util";
import { displayName } from "../format/formatUser";
import { LynxLogger } from "../log/log.util";
import { getBundleQuery } from "../prisma/queries/getBundleQuery";
import { getProductQuery } from "../prisma/queries/getProduct.query";
import { updateMemberQuery } from "../prisma/queries/updateMember.query";

export async function onProductPurchaseAsync(webhookProduct: Product) {
  const mappedRoleIds = getCodelineRoleIds(webhookProduct.itemId);
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

  if (!bundle && !product && mappedRoleIds.length === 0)
    throw new Error(`Product "${webhookProduct.itemId}" not found`);

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

  if (webhookProduct.userDiscordId) {
    try {
      const guild = client.guilds.cache.get(env.SERVER_ID);
      if (!guild)
        throw new Error("Guild not found");

      const member = await guild.members.fetch(webhookProduct.userDiscordId);
      const roleIds = mappedRoleIds.length > 0
        ? mappedRoleIds
        : product
          ? [product.discordRoleId]
          : bundle?.products.map(product => product.discordRoleId) ?? [];
      await member.roles.add(roleIds);

      const rolesString = roleIds.map(roleId => `<@&${roleId}>`).join(" ,");

      LynxLogger.info(`New product purchase
        Added role${bundle ? "s" : null} ${rolesString} to ${displayName(member)} with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map(p => p.name).join(", ")}` : ""}`);
    }
    catch (error) {
      LynxLogger.warn(
        `Webhook Codeline\nFailed to update member : <@${
          webhookProduct.userDiscordId
        }>\`${webhookProduct.email}\` with product or bundle.\n${anyToError(error).message}`,
      );
    }
  }
}

export async function onProductRefundAsync(webhookProduct: Product) {
  const mappedRoleIds = getCodelineRoleIds(webhookProduct.itemId);
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
  if (!bundle && !product && mappedRoleIds.length === 0)
    throw new Error(`Product "${webhookProduct.itemId}" not found`);

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

  if (webhookProduct.userDiscordId) {
    try {
      const guild = client.guilds.cache.get(env.SERVER_ID);
      if (!guild)
        throw new Error("Guild not found");

      const member = await guild.members.fetch(webhookProduct.userDiscordId);
      const roleIds = mappedRoleIds.length > 0
        ? mappedRoleIds
        : product
          ? [product.discordRoleId]
          : bundle?.products.map(product => product.discordRoleId) ?? [];
      const [codelineUser, codelineUserError] = await getUser(webhookProduct.email);
      const retainedRoleIds = codelineUserError
        ? []
        : (codelineUser?.products ?? []).flatMap(product => getCodelineRoleIds(product.id));
      const roleIdsToRemove = roleIds.filter(roleId => !retainedRoleIds.includes(roleId));
      await member.roles.remove(roleIdsToRemove);

      const rolesString = roleIdsToRemove.map(roleId => `<@&${roleId}>`).join(" ,");

      LynxLogger.info(`New product refund
        Removed role${bundle ? "s" : null} ${rolesString} to ${displayName(member)} with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map(p => p.name).join(", ")}` : ""}`);
    }
    catch (error) {
      defaultLogger.warning(
        `Webhook Codeline\nFailed to update member : <@${
          webhookProduct.userDiscordId
        }>\`${webhookProduct.email}\` with product or bundle.\n${anyToError(error).message}`,
      );
    }
  }
}
