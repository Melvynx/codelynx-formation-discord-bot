import { env } from "@/utils/env/env.util";

const CODELYNX_ROLE_MAPPING = {
  nextreact: env.NEXTREACT_ROLE_ID,
  beginreact: env.BEGINREACT_ROLE_ID,
  beginjavascript: env.BEGINJAVASCRIPT_ROLE_ID,
  nextailwind: env.NEXTAILWIND_ROLE_ID,
  nextai: env.NEXTAI_ROLE_ID,
  nowts: env.NOWTS_ROLE_ID,
  nowtspro: env.NOWTSPRO_ROLE_ID,
  beginweb: env.BEGINWEB_ROLE_ID,
  nextfullstack: env.NEXTFULLSTACK_ROLE_ID,
  aibuilder: env.AIBUILDER_ROLE_ID,
  claudecode: env.CLAUDECODE_ROLE_ID,
  aibuilderMobile: env.AIBUILDER_MOBILE_ROLE_ID,
  nowstack: env.NOWSTACK_ROLE_ID,
  assistantPro: env.ASSISTANTPRO_ROLE_ID,
} as const;

export const CODELINE_PRODUCT_MAPPING_CODELYNX_ROLE: Record<string, string[]> =
  {
    // Begin JavaScript product mapping
    cle0ad95a0001jw08hn80in2y: [CODELYNX_ROLE_MAPPING.beginjavascript],
    // Next React product mapping
    cld1rbuvp0003knu4nhodbbf0: [CODELYNX_ROLE_MAPPING.nextreact],
    // Begin React product mapping
    clgq5mk240001l708k856eu52: [CODELYNX_ROLE_MAPPING.beginreact],
    // Next AI product mapping
    clpqdoypw000313wyuc7cly2f: [CODELYNX_ROLE_MAPPING.nextai],
    // NOW.TS product mapping
    clqn8pmte0001lr54itcjzl59: [CODELYNX_ROLE_MAPPING.nowts],
    // Next Tailwind product mapping
    clukhuak400017z3wlz6iw39r: [CODELYNX_ROLE_MAPPING.nextailwind],
    // Begin Web product mapping
    clru0nzup000154ft70e637p1: [CODELYNX_ROLE_MAPPING.beginweb],
    // Next Full Stack product mapping
    nextfullstack: [CODELYNX_ROLE_MAPPING.nextfullstack],
    // AI Builder product mapping
    prd_NGOWh9cxyR: [CODELYNX_ROLE_MAPPING.aibuilder],
    // Claude Code Setup product mapping
    prd_k6RqsLYhO9: [CODELYNX_ROLE_MAPPING.claudecode],
    // Claude Code Config product mapping
    prd_XJVgxVPbGG: [CODELYNX_ROLE_MAPPING.claudecode],
    // AI Builder Mobile paid course
    prd_9ndSxkfHQE: [CODELYNX_ROLE_MAPPING.aibuilderMobile],
    // NowStack SaaS and Mobile share the NowStack members area
    prd_H7vVxAv4xH: [CODELYNX_ROLE_MAPPING.nowstack],
    prd_0R4nrZuDqZ: [CODELYNX_ROLE_MAPPING.nowstack],
    // AssistantPro / OpenClaw members area
    prd_t2GRwX3aH1: [CODELYNX_ROLE_MAPPING.assistantPro],
  } as const;

export const CODELINE_BUNDLE_MAPPING_CODELYNX_ROLE: Record<string, string[]> = {
  // React Pro Bundle
  clglz5oc90001me08ppf3uaeq: [
    CODELYNX_ROLE_MAPPING.beginreact,
    CODELYNX_ROLE_MAPPING.nextreact,
  ],
  // Web Pro Bundle
  clldce38o0001mk08bn4i2djz: [
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // NOW.TS PRO BUNDLE
  clldnguja0001l008g3dfqpit: [
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
    CODELYNX_ROLE_MAPPING.nextreact,
  ],
  clsea957000011tx34a5zuuzl: [CODELYNX_ROLE_MAPPING.nowts],
  // AIBlueprint.dev + NOW.TS Bundle
  clti1z8gj000112j8yg8wcdpq: [
    CODELYNX_ROLE_MAPPING.nextai,
    CODELYNX_ROLE_MAPPING.nowts,
    CODELYNX_ROLE_MAPPING.claudecode,
  ],
  // FastDeveloper
  YOV8w_955Sy: [
    CODELYNX_ROLE_MAPPING.beginweb,
    CODELYNX_ROLE_MAPPING.nextreact,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // Web Start Pack
  nXwX0IU8Z_J: [
    CODELYNX_ROLE_MAPPING.beginweb,
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // Web React Bundle
  "1jsvTquJLHq": [
    CODELYNX_ROLE_MAPPING.beginweb,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // WebDeveloper
  LJYv0rHqQ7P: [
    CODELYNX_ROLE_MAPPING.nextreact,
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // SaaS Bundle
  cluryhgck0001rqsd1ji03b3r: [
    CODELYNX_ROLE_MAPPING.nextai,
    CODELYNX_ROLE_MAPPING.nextreact,
    CODELYNX_ROLE_MAPPING.nowtspro,
    CODELYNX_ROLE_MAPPING.nowts,
  ],
  // FullStack React
  nextfullstackreact: [
    CODELYNX_ROLE_MAPPING.nextfullstack,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  // AI Builder Pro Bundle
  bdl_kHtjzk7xJW: [
    CODELYNX_ROLE_MAPPING.aibuilder,
    CODELYNX_ROLE_MAPPING.nowts,
    CODELYNX_ROLE_MAPPING.nowtspro,
    CODELYNX_ROLE_MAPPING.beginweb,
    CODELYNX_ROLE_MAPPING.claudecode,
  ],
  // Claude Code Pro Bundle
  bdl_9Q4m57erDF: [CODELYNX_ROLE_MAPPING.claudecode],
  // AI Builder Mobile + NowStack Mobile, without Agents Config PRO
  bdl_FBDTkzMfwp: [
    CODELYNX_ROLE_MAPPING.aibuilderMobile,
    CODELYNX_ROLE_MAPPING.nowstack,
  ],
  // AI Builder Mobile + NowStack Mobile + Agents Config PRO
  bdl_La5lxKUR4t: [
    CODELYNX_ROLE_MAPPING.aibuilderMobile,
    CODELYNX_ROLE_MAPPING.nowstack,
    CODELYNX_ROLE_MAPPING.claudecode,
  ],
  // AI Builder ULTRA: SaaS + Mobile + both NowStacks + Agents + AssistantPro
  bdl_SM0868YaZY: [
    CODELYNX_ROLE_MAPPING.aibuilder,
    CODELYNX_ROLE_MAPPING.aibuilderMobile,
    CODELYNX_ROLE_MAPPING.nowstack,
    CODELYNX_ROLE_MAPPING.claudecode,
    CODELYNX_ROLE_MAPPING.assistantPro,
  ],
  // NowStack SaaS + NowStack Mobile
  bdl_67ux9gZ9Fp: [CODELYNX_ROLE_MAPPING.nowstack],
} as const;

export function getCodelineRoleIds(itemId: string): string[] {
  return [
    ...(CODELINE_PRODUCT_MAPPING_CODELYNX_ROLE[itemId] ?? []),
    ...(CODELINE_BUNDLE_MAPPING_CODELYNX_ROLE[itemId] ?? []),
  ].filter((roleId, index, roleIds) => roleIds.indexOf(roleId) === index);
}
