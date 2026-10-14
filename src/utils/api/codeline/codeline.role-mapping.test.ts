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
    EDITING_IA_PRO_ROLE_ID: "editingIaPro",
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

describe("editing IA Pro Discord role mapping", () => {
  it("maps the Editing IA Pro course to its role", () => {
    expect(getCodelineRoleIds("prd_DweXwfpCXz")).toEqual(["editingIaPro"]);
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

const AI_BUILDER_CLUB_PRODUCT_IDS = [
  "prd_IGANgWSfkA",
  "clru0nzup000154ft70e637p1",
  "clgq5mk240001l708k856eu52",
  "prd_H7vVxAv4xH",
  "prd_NGOWh9cxyR",
  "clpqdoypw000313wyuc7cly2f",
  "prd_XJVgxVPbGG",
  "cle0ad95a0001jw08hn80in2y",
  "prd_9ndSxkfHQE",
  "prd_Br8Cd7lzdG",
  "prd_t2GRwX3aH1",
  "prd_DweXwfpCXz",
  "prd_0R4nrZuDqZ",
];

const AI_BUILDER_CLUB_ROLE_IDS = [
  "aibuilder",
  "aibuilderMobile",
  "nowstack",
  "nowstackMobile",
  "claudecode",
  "assistantPro",
  "editingIaPro",
  "nextai",
  "beginweb",
  "beginreact",
  "beginjavascript",
];

describe("editing IA Pro and AI Builder Club role mapping", () => {
  it("maps the Editing IA Pro product to the Editing IA Pro role", () => {
    expect(getCodelineRoleIds("prd_DweXwfpCXz")).toEqual(["editingIaPro"]);
  });

  it("maps the AI Builder Club bundle to every mapped formation role", () => {
    expect(getCodelineRoleIds("bdl_Dg1acCvU4K")).toEqual(AI_BUILDER_CLUB_ROLE_IDS);
  });

  it("derives the same roles from the Club products returned as entitlements", () => {
    expect([...getCodelineRoleIdsForProducts(AI_BUILDER_CLUB_PRODUCT_IDS)].sort())
      .toEqual([...AI_BUILDER_CLUB_ROLE_IDS].sort());
  });

  it("keeps every Club role during exact reconciliation for an active Club member", () => {
    expect(getCodelineRoleDelta(
      [...AI_BUILDER_CLUB_ROLE_IDS, "unrelated"],
      getCodelineRoleIdsForProducts(AI_BUILDER_CLUB_PRODUCT_IDS),
    )).toEqual({ roleIdsToAdd: [], roleIdsToRemove: [] });
  });

  it("keeps the Editing IA Pro role when entitlements include the product", () => {
    expect(getCodelineRoleDelta(
      ["editingIaPro"],
      getCodelineRoleIdsForProducts(["prd_DweXwfpCXz"]),
    )).toEqual({ roleIdsToAdd: [], roleIdsToRemove: [] });
  });

  it("removes the managed Editing IA Pro role when entitlements lack the product", () => {
    expect(getCodelineRoleDelta(
      ["editingIaPro", "unrelated"],
      getCodelineRoleIdsForProducts(["prd_NGOWh9cxyR"]),
    )).toEqual({ roleIdsToAdd: ["aibuilder"], roleIdsToRemove: ["editingIaPro"] });
  });
});
