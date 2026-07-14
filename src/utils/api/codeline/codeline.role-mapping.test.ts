import { describe, expect, it, vi } from "vitest";

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

const {
  getCodelineRoleDelta,
  getCodelineRoleIds,
  getCodelineRoleIdsForProducts,
} = await import("./codeline.role-mapping");

describe("nowStack Discord role mapping", () => {
  it.each([
    ["prd_H7vVxAv4xH", ["nowstack"]],
    ["prd_0R4nrZuDqZ", ["nowstackMobile"]],
    ["bdl_FBDTkzMfwp", ["aibuilderMobile", "nowstackMobile"]],
    ["bdl_La5lxKUR4t", ["aibuilderMobile", "nowstackMobile", "claudecode"]],
    [
      "bdl_SM0868YaZY",
      [
        "aibuilder",
        "aibuilderMobile",
        "nowstack",
        "nowstackMobile",
        "claudecode",
        "assistantPro",
      ],
    ],
    ["bdl_67ux9gZ9Fp", ["nowstack", "nowstackMobile"]],
  ])("maps %s to the expected NowStack roles", (itemId, expectedRoleIds) => {
    expect(getCodelineRoleIds(itemId)).toEqual(expectedRoleIds);
  });
});

describe("current Codeline product role mapping", () => {
  it("maps NOW.TS PRO at product level", () => {
    expect(getCodelineRoleIds("clsb26tj500014fs4mgsnavvy")).toEqual(["nowtspro"]);
  });

  it("deduplicates desired roles across repeated and overlapping products", () => {
    expect(getCodelineRoleIdsForProducts([
      "prd_k6RqsLYhO9",
      "prd_XJVgxVPbGG",
      "prd_k6RqsLYhO9",
      "unknown-product",
    ])).toEqual(["claudecode"]);
  });

  it("maps bundle IDs returned as current entitlements", () => {
    expect(getCodelineRoleIdsForProducts(["clglz5oc90001me08ppf3uaeq"])).toEqual([
      "beginreact",
      "nextreact",
    ]);
  });
});

describe("codeline role delta", () => {
  it("adds missing desired roles and removes only stale mapped roles", () => {
    expect(getCodelineRoleDelta(
      ["unrelated", "nowtspro", "beginreact"],
      ["nowts", "beginreact"],
    )).toEqual({
      roleIdsToAdd: ["nowts"],
      roleIdsToRemove: ["nowtspro"],
    });
  });

  it("treats additional database role IDs as managed", () => {
    expect(getCodelineRoleDelta(
      ["unrelated", "database-only-role"],
      [],
      ["database-only-role"],
    )).toEqual({
      roleIdsToAdd: [],
      roleIdsToRemove: ["database-only-role"],
    });
  });
});
