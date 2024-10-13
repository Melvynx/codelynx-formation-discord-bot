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
  console.log("🚀 ~ onProductPurchaseAsync ~ data:", webhookProduct);

  const product = await GetProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });
  console.log("🚀 ~ onProductPurchaseAsync ~ product:", product);

  let bundle;
  if (!product)
    bundle = await GetBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });
  console.log("🚀 ~ onProductPurchaseAsync ~ bundle:", bundle);

  if (!bundle && !product) throw new Error("Product not found");
  console.log("🚀 ~ onProductPurchaseAsync ~ webhookProduct:", webhookProduct);

  const user =
    (await GetMemberQuery({ where: { id: webhookProduct.userId } })) ??
    (await CreateNewMemberQuery({
      data: {
        id: webhookProduct.userId,
        email: webhookProduct.email,
        discordUserId: webhookProduct.userDiscordId,
      },
    }));
  console.log("🚀 ~ onProductPurchaseAsync ~ user:", user);

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
        `Failed to update member with bundle ${anyToError(error).message}`
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
        `Failed to update member with product ${anyToError(error).message}`
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

      LynxLogger.info(`Added role(s) to <@${member.user.id}> with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map((p) => p.name).join(", ")}` : ""}`);
    } catch (error) {
      defaultLogger.warning(
        `Failed to update member with product ${anyToError(error).message}`
      );
    }
  }
};

export const onProductRefundAsync = async (webhookProduct: Product) => {
  console.log("🚀 ~ onProductPurchaseAsync ~ data:", webhookProduct);

  const product = await GetProductQuery({
    where: {
      id: webhookProduct.itemId,
    },
  });
  console.log("🚀 ~ onProductPurchaseAsync ~ product:", product);

  let bundle;
  if (!product)
    bundle = await GetBundleQuery({
      where: {
        id: webhookProduct.itemId,
      },
    });
  console.log("🚀 ~ onProductPurchaseAsync ~ bundle:", bundle);

  if (!bundle && !product) throw new Error("Product not found");
  console.log("🚀 ~ onProductPurchaseAsync ~ webhookProduct:", webhookProduct);

  const user =
    (await GetMemberQuery({ where: { id: webhookProduct.userId } })) ??
    (await CreateNewMemberQuery({
      data: {
        id: webhookProduct.userId,
        email: webhookProduct.email,
        discordUserId: webhookProduct.userDiscordId,
      },
    }));
  console.log("🚀 ~ onProductPurchaseAsync ~ user:", user);

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
        `Failed to update member with bundle ${anyToError(error).message}`
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
        `Failed to update member with product ${anyToError(error).message}`
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

      LynxLogger.info(`Removed role(s) to <@${member.user.id}> with
      ${product ? `product ${product.name}` : ""}
      ${bundle ? `bundle ${bundle.products.map((p) => p.name).join(", ")}` : ""}`);
    } catch (error) {
      defaultLogger.warning(
        `Failed to update member with product ${anyToError(error).message}`
      );
    }
  }
};
