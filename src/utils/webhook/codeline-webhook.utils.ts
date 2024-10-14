import { client } from "@/index";
import { anyToError, defaultLogger } from "arcscord";
import { env } from "../env/env.util";
import { LynxLogger } from "../log/log.util";
import { CreateNewMemberQuery } from "../prisma/queries/createNewMember.query";
import { GetBundleQuery } from "../prisma/queries/getBundle.query";
import { GetMemberQuery } from "../prisma/queries/getMember.query";
import { GetProductQuery } from "../prisma/queries/getProduct.query";
import { UpdateMemberQuery } from "../prisma/queries/updateMember.query";
import type { Product } from "./webhook.type";

export const onProductPurchaseAsync = async (webhookProduct: Product) => {
  const product = await GetProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });
  let bundle;
  if (!product)
    bundle = await GetBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });

  if (!bundle && !product)
    throw new Error(`Product "${webhookProduct.itemId}" not found`);
  const user =
    (await GetMemberQuery({ where: { id: webhookProduct.userId } })) ??
    (await CreateNewMemberQuery({
      data: {
        id: webhookProduct.userId,
        email: webhookProduct.email,
        discordUserId: webhookProduct.userDiscordId,
      },
    }));

  if (bundle) {
    try {
      await UpdateMemberQuery({
        where: {
          id: webhookProduct.userId,
        },
        data: {
          discordUserId: webhookProduct.userDiscordId,
          bundle: {
            connect: {
              id: bundle.id,
            },
          },
        },
      });
    } catch (error) {
      defaultLogger.warning(
        `Failed to add bundle ${anyToError(error).message} to member ${
          user.id
        } in database`
      );
    }
  }

  if (product) {
    try {
      await UpdateMemberQuery({
        where: {
          id: webhookProduct.userId,
        },
        data: {
          discordUserId: webhookProduct.userDiscordId,
          products: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    } catch (error) {
      defaultLogger.warning(
        `Failed to add product ${anyToError(error).message} to member ${
          user.id
        } in database`
      );
    }
  }

  if (webhookProduct.userDiscordId) {
    try {
      const guild = client.guilds.cache.get(env.SERVER_ID);
      if (!guild) throw new Error("Guild not found");

      const member = await guild.members.fetch(webhookProduct.userDiscordId);
      if (product) await member.roles.add(product.discordRoleId);
      if (bundle)
        await Promise.all(
          bundle.products.map((product) => member.roles.add(product.discordRoleId))
        );

      LynxLogger.info(`New product purchase
        Added role(s) to <@${member.user.id}>(${member.user.username}) with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map((p) => p.name).join(", ")}` : ""}`);
    } catch (error) {
      LynxLogger.warn(
        `Webhook Codeline\nFailed to update member : <@${
          user.discordUserId
        }> with product or bundle.\n${anyToError(error).message}`
      );
    }
  }
};

export const onProductRefundAsync = async (webhookProduct: Product) => {
  const product = await GetProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });

  let bundle;
  if (!product)
    bundle = await GetBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });
  if (!bundle && !product)
    throw new Error(`Product "${webhookProduct.itemId}" not found`);
  const user =
    (await GetMemberQuery({ where: { id: webhookProduct.userId } })) ??
    (await CreateNewMemberQuery({
      data: {
        id: webhookProduct.userId,
        email: webhookProduct.email,
        discordUserId: webhookProduct.userDiscordId,
      },
    }));
  if (bundle) {
    try {
      await UpdateMemberQuery({
        where: {
          id: webhookProduct.userId,
        },
        data: {
          discordUserId: webhookProduct.userDiscordId,
          bundle: {
            disconnect: {
              id: bundle.id,
            },
          },
        },
      });
    } catch (error) {
      defaultLogger.warning(
        `Failed to remove bundle ${anyToError(error).message} to member ${
          user.id
        } in database`
      );
    }
  }

  if (product) {
    try {
      await UpdateMemberQuery({
        where: {
          id: webhookProduct.userId,
        },
        data: {
          discordUserId: webhookProduct.userDiscordId,
          products: {
            disconnect: {
              id: product.id,
            },
          },
        },
      });
    } catch (error) {
      defaultLogger.warning(
        `Failed to remove product ${anyToError(error).message} to member ${
          user.id
        } in database`
      );
    }
  }

  if (webhookProduct.userDiscordId) {
    try {
      const guild = client.guilds.cache.get(env.SERVER_ID);
      if (!guild) throw new Error("Guild not found");

      const member = await guild.members.fetch(webhookProduct.userDiscordId);
      if (product) await member.roles.remove(product.discordRoleId);
      if (bundle)
        await Promise.all(
          bundle.products.map((product) =>
            member.roles.remove(product.discordRoleId)
          )
        );

      LynxLogger.info(`New product refund
        Added role(s) to <@${member.user.id}>(${member.user.username}) with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map((p) => p.name).join(", ")}` : ""}`);
    } catch (error) {
      defaultLogger.warning(
        `Webhook Codeline\nFailed to update member : <@${
          user.discordUserId
        }> with product or bundle.\n${anyToError(error).message}`
      );
    }
  }
};
