import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/env/env.util", () => ({
  env: {
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

vi.mock("../../prisma/queries/getBundleQuery", () => ({
  getBundlesQuery: vi.fn(),
}));

vi.mock("../../prisma/queries/getProduct.query", () => ({
  getProductsQuery: vi.fn(),
}));

const { getBundlesQuery } = await import("../../prisma/queries/getBundleQuery");
const { getProductsQuery } = await import("../../prisma/queries/getProduct.query");
const { resolveCodelineRoleState } = await import("./codeline.role-state");

describe("codeline role-state resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProductsQuery).mockResolvedValue([
      {
        id: "database-product",
        name: "Database product",
        premium: true,
        discordRoleId: "database-product-role",
      },
      {
        id: "other-product",
        name: "Other product",
        premium: true,
        discordRoleId: "other-database-role",
      },
    ]);
    vi.mocked(getBundlesQuery).mockResolvedValue([
      {
        id: "database-bundle",
        products: [
          {
            id: "bundled-product",
            name: "Bundled product",
            premium: true,
            discordRoleId: "database-bundle-role",
          },
        ],
      },
    ] as never);
  });

  it("combines static, direct database product, and direct database bundle roles in bulk", async () => {
    await expect(resolveCodelineRoleState([
      "clqn8pmte0001lr54itcjzl59",
      "database-product",
      "database-bundle",
    ])).resolves.toEqual({
      desiredRoleIds: ["nowts", "database-product-role", "database-bundle-role"],
      additionalManagedRoleIds: [
        "database-product-role",
        "other-database-role",
        "database-bundle-role",
      ],
    });
    expect(getProductsQuery).toHaveBeenCalledTimes(1);
    expect(getBundlesQuery).toHaveBeenCalledTimes(1);
  });
});
