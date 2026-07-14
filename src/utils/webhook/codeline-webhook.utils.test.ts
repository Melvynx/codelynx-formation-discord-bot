import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../env/env.util", () => ({
  env: {
    SERVER_ID: "guild-id",
  },
}));

vi.mock("@/utils/env/env.util", () => ({
  env: {
    SERVER_ID: "guild-id",
    NEXTREACT_ROLE_ID: "nextreact",
    BEGINJAVASCRIPT_ROLE_ID: "beginjavascript",
    BEGINREACT_ROLE_ID: "beginreact",
    NEXTAILWIND_ROLE_ID: "nextailwind",
    NEXTAI_ROLE_ID: "nextai",
    NOWTS_ROLE_ID: "nowts",
    NOWTSPRO_ROLE_ID: "nowtspro",
    BEGINWEB_ROLE_ID: "beginweb",
    NEXTFULLSTACK_ROLE_ID: "nextfullstack",
    AIBUILDER_ROLE_ID: "aibuilder",
    CLAUDECODE_ROLE_ID: "claudecode",
    AIBUILDER_MOBILE_ROLE_ID: "aibuilderMobile",
    NOWSTACK_SAAS_ROLE_ID: "nowstack",
    NOWSTACK_MOBILE_ROLE_ID: "nowstackMobile",
    ASSISTANTPRO_ROLE_ID: "assistantPro",
  },
}));

vi.mock("@/index", () => ({
  client: {
    guilds: {
      cache: {
        get: vi.fn(),
      },
    },
  },
}));

vi.mock("../api/codeline/codeline.util", () => ({
  getUser: vi.fn(),
}));

vi.mock("../prisma/queries/getBundleQuery", () => ({
  getBundleQuery: vi.fn(),
  getBundlesQuery: vi.fn(),
}));

vi.mock("../prisma/queries/getProduct.query", () => ({
  getProductQuery: vi.fn(),
  getProductsQuery: vi.fn(),
}));

vi.mock("../prisma/queries/updateMember.query", () => ({
  updateMemberQuery: vi.fn(),
}));

vi.mock("../format/formatUser", () => ({
  displayName: vi.fn(() => "member"),
}));

vi.mock("../log/log.util", () => ({
  LynxLogger: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

const { client } = await import("@/index");
const { getUser } = await import("../api/codeline/codeline.util");
const {
  getBundleQuery,
  getBundlesQuery,
} = await import("../prisma/queries/getBundleQuery");
const {
  getProductQuery,
  getProductsQuery,
} = await import("../prisma/queries/getProduct.query");
const { updateMemberQuery } = await import("../prisma/queries/updateMember.query");
const {
  onProductPurchaseAsync,
  onProductRefundAsync,
} = await import("./codeline-webhook.utils");

const webhookProduct = {
  userId: "codeline-user",
  userDiscordId: "payload-discord-id",
  email: "lynx@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
  amount: 100,
  currency: "EUR",
  itemId: "future-bundle-without-static-mapping",
  itemTitle: "Future bundle",
  itemType: "bundle" as const,
};

function codelineUser(discordId: string | null = "payload-discord-id") {
  return {
    discordId,
    products: [
      { id: "clqn8pmte0001lr54itcjzl59", title: "NOW.TS" },
    ],
  };
}

function guildMember(roleIds = ["unrelated", "nowtspro"]) {
  return {
    roles: {
      cache: new Map(roleIds.map(roleId => [roleId, {}])),
      add: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
  };
}

describe("codeline webhook role synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProductQuery).mockResolvedValue(null);
    vi.mocked(getProductsQuery).mockResolvedValue([]);
    vi.mocked(getBundleQuery).mockResolvedValue(null);
    vi.mocked(getBundlesQuery).mockResolvedValue([]);
    vi.mocked(getUser).mockResolvedValue([codelineUser(), null]);
  });

  it("reconciles expanded current products for a future unknown bundle on refund", async () => {
    const member = guildMember();
    const fetchMember = vi.fn().mockResolvedValue(member);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: fetchMember },
    } as never);

    await onProductRefundAsync(webhookProduct);

    expect(getUser).toHaveBeenCalledWith(webhookProduct.email);
    expect(fetchMember).toHaveBeenCalledWith(webhookProduct.userDiscordId);
    expect(member.roles.add).toHaveBeenCalledWith("nowts");
    expect(member.roles.remove).toHaveBeenCalledWith("nowtspro");
    expect(member.roles.remove).not.toHaveBeenCalledWith("unrelated");
  });

  it("adds expanded current products for a future unknown bundle purchase without removing roles", async () => {
    const member = guildMember();
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductPurchaseAsync(webhookProduct);

    expect(member.roles.add).toHaveBeenCalledWith("nowts");
    expect(member.roles.remove).not.toHaveBeenCalled();
  });

  it("grants a database-only role for a current Codeline product", async () => {
    vi.mocked(getUser).mockResolvedValue([{
      discordId: "payload-discord-id",
      products: [{ id: "database-product", title: "Database product" }],
    }, null]);
    vi.mocked(getProductsQuery).mockResolvedValue([{
      id: "database-product",
      name: "Database product",
      premium: true,
      discordRoleId: "database-only-role",
    }]);
    const member = guildMember([]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductRefundAsync(webhookProduct);

    expect(getProductsQuery).toHaveBeenCalledTimes(1);
    expect(member.roles.add).toHaveBeenCalledWith("database-only-role");
  });

  it("removes a stale database-only managed role on refund", async () => {
    vi.mocked(getUser).mockResolvedValue([{
      discordId: "payload-discord-id",
      products: [],
    }, null]);
    vi.mocked(getProductsQuery).mockResolvedValue([{
      id: "database-product",
      name: "Database product",
      premium: true,
      discordRoleId: "database-only-role",
    }]);
    const member = guildMember(["unrelated", "database-only-role"]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductRefundAsync(webhookProduct);

    expect(member.roles.remove).toHaveBeenCalledWith("database-only-role");
    expect(member.roles.remove).not.toHaveBeenCalledWith("unrelated");
  });

  it("grants child product roles for a database-only bundle entitlement on refund", async () => {
    vi.mocked(getUser).mockResolvedValue([{
      discordId: "payload-discord-id",
      products: [{ id: "database-bundle", title: "Database bundle" }],
    }, null]);
    vi.mocked(getBundlesQuery).mockResolvedValue([{
      id: "database-bundle",
      products: [{
        id: "bundled-product",
        name: "Bundled product",
        premium: true,
        discordRoleId: "database-bundle-role",
      }],
    }] as never);
    const member = guildMember([]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductRefundAsync(webhookProduct);

    expect(getBundlesQuery).toHaveBeenCalledTimes(1);
    expect(member.roles.add).toHaveBeenCalledWith("database-bundle-role");
  });

  it.each([
    [
      "product",
      () => vi.mocked(getProductQuery).mockResolvedValue({
        id: webhookProduct.itemId,
        name: "Database product",
        premium: true,
        discordRoleId: "event-database-role",
      }),
    ],
    [
      "bundle",
      () => vi.mocked(getBundleQuery).mockResolvedValue({
        id: webhookProduct.itemId,
        products: [{
          id: "bundled-product",
          name: "Bundled product",
          premium: true,
          discordRoleId: "event-database-role",
        }],
      } as never),
    ],
  ])("grants the current event item's database %s role on purchase", async (_kind, configureEventItem) => {
    vi.mocked(getUser).mockResolvedValue([{
      discordId: "payload-discord-id",
      products: [],
    }, null]);
    configureEventItem();
    const member = guildMember([]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductPurchaseAsync(webhookProduct);

    expect(member.roles.add).toHaveBeenCalledWith("event-database-role");
    expect(member.roles.remove).not.toHaveBeenCalled();
  });

  it("does not remove an existing managed role from a possibly stale purchase snapshot", async () => {
    const member = guildMember(["nowtspro"]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductPurchaseAsync(webhookProduct);

    expect(member.roles.add).toHaveBeenCalledWith("nowts");
    expect(member.roles.remove).not.toHaveBeenCalled();
  });

  it("falls back to a known event item's static roles when the current snapshot is stale", async () => {
    vi.mocked(getUser).mockResolvedValue([{
      discordId: "payload-discord-id",
      products: [],
    }, null]);
    const member = guildMember([]);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductPurchaseAsync({
      ...webhookProduct,
      itemId: "clqn8pmte0001lr54itcjzl59",
      itemType: "product",
    });

    expect(member.roles.add).toHaveBeenCalledWith("nowts");
    expect(member.roles.remove).not.toHaveBeenCalled();
  });

  it("falls back to the linked Codeline Discord ID when the payload omits it", async () => {
    vi.mocked(getUser).mockResolvedValue([codelineUser("linked-discord-id"), null]);
    const member = guildMember(["nowts"]);
    const fetchMember = vi.fn().mockResolvedValue(member);
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: fetchMember },
    } as never);

    await onProductPurchaseAsync({
      ...webhookProduct,
      userDiscordId: undefined,
    });

    expect(fetchMember).toHaveBeenCalledWith("linked-discord-id");
  });

  it.each([
    ["purchase", onProductPurchaseAsync],
    ["refund", onProductRefundAsync],
  ])("rejects a %s identity mismatch before updating the database", async (_event, handler) => {
    vi.mocked(getUser).mockResolvedValue([codelineUser("different-discord-id"), null]);
    vi.mocked(getProductQuery).mockResolvedValue({
      id: webhookProduct.itemId,
      name: "Database product",
      premium: true,
      discordRoleId: "database-role",
    });

    await expect(handler(webhookProduct)).rejects.toThrow(
      "Discord ID mismatch",
    );

    expect(updateMemberQuery).not.toHaveBeenCalled();
    expect(client.guilds.cache.get).not.toHaveBeenCalled();
  });

  it("leaves synchronization pending when neither source has a Discord ID", async () => {
    vi.mocked(getUser).mockResolvedValue([codelineUser(null), null]);

    await expect(onProductPurchaseAsync({
      ...webhookProduct,
      userDiscordId: undefined,
    })).resolves.toBeUndefined();

    expect(client.guilds.cache.get).not.toHaveBeenCalled();
  });

  it("leaves synchronization pending when the linked user is absent from the guild", async () => {
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: {
        fetch: vi.fn().mockRejectedValue(Object.assign(new Error("Unknown Member"), { code: 10007 })),
      },
    } as never);

    await expect(onProductRefundAsync(webhookProduct)).resolves.toBeUndefined();
  });

  it("propagates other Discord failures", async () => {
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: {
        fetch: vi.fn().mockRejectedValue(new Error("Discord unavailable")),
      },
    } as never);

    await expect(onProductPurchaseAsync(webhookProduct)).rejects.toThrow("Discord unavailable");
  });

  it("keeps newly added desired roles when additions and removals both occur", async () => {
    const cachedRoleIds = ["nowtspro"];
    const actualRoleIds = new Set(cachedRoleIds);
    const member = {
      roles: {
        cache: new Map(cachedRoleIds.map(roleId => [roleId, {}])),
        add: vi.fn(async (roleId: string | string[]) => {
          if (Array.isArray(roleId)) {
            actualRoleIds.clear();
            for (const cachedRoleId of cachedRoleIds)
              actualRoleIds.add(cachedRoleId);
            for (const addedRoleId of roleId)
              actualRoleIds.add(addedRoleId);
          }
          else {
            actualRoleIds.add(roleId);
          }
        }),
        remove: vi.fn(async (roleId: string | string[]) => {
          if (Array.isArray(roleId)) {
            actualRoleIds.clear();
            for (const cachedRoleId of cachedRoleIds) {
              if (!roleId.includes(cachedRoleId))
                actualRoleIds.add(cachedRoleId);
            }
          }
          else {
            actualRoleIds.delete(roleId);
          }
        }),
      },
    };
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await onProductRefundAsync(webhookProduct);

    expect(actualRoleIds).toEqual(new Set(["nowts"]));
    expect(member.roles.add).toHaveBeenCalledWith("nowts");
    expect(member.roles.remove).toHaveBeenCalledWith("nowtspro");
  });

  it("propagates Discord role mutation failures", async () => {
    const member = guildMember();
    member.roles.add.mockRejectedValue(new Error("Missing Permissions"));
    vi.mocked(client.guilds.cache.get).mockReturnValue({
      members: { fetch: vi.fn().mockResolvedValue(member) },
    } as never);

    await expect(onProductPurchaseAsync(webhookProduct)).rejects.toThrow("Missing Permissions");
  });

  it("propagates Codeline failures", async () => {
    vi.mocked(getUser).mockResolvedValue([null, new Error("Codeline unavailable") as never]);

    await expect(onProductRefundAsync(webhookProduct)).rejects.toThrow("Codeline unavailable");
  });
});
