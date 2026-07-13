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

const { getCodelineRoleIds } = await import("./codeline.role-mapping");

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
