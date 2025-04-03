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
  nextfullstack: "1350383276325343243",
} as const;

export const CODELINE_PRODUCT_MAPPING_CODELYNX_ROLE: Record<string, string[]> = {
  cle0ad95a0001jw08hn80in2y: [CODELYNX_ROLE_MAPPING.beginjavascript],
  cld1rbuvp0003knu4nhodbbf0: [CODELYNX_ROLE_MAPPING.nextreact],
  clgq5mk240001l708k856eu52: [CODELYNX_ROLE_MAPPING.beginreact],
  clpqdoypw000313wyuc7cly2f: [CODELYNX_ROLE_MAPPING.nextai],
  clqn8pmte0001lr54itcjzl59: [CODELYNX_ROLE_MAPPING.nowts],
  clukhuak400017z3wlz6iw39r: [CODELYNX_ROLE_MAPPING.nextailwind],
  clru0nzup000154ft70e637p1: [CODELYNX_ROLE_MAPPING.beginweb],
  nextfullstack: [CODELYNX_ROLE_MAPPING.nextfullstack]
} as const;

export const CODELINE_BUNDLE_MAPPING_CODELYNX_ROLE: Record<string, string[]> = {
  clglz5oc90001me08ppf3uaeq: [
    CODELYNX_ROLE_MAPPING.beginreact,
    CODELYNX_ROLE_MAPPING.nextreact,
  ],
  clldce38o0001mk08bn4i2djz: [
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
  ],
  clldnguja0001l008g3dfqpit: [
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,
    CODELYNX_ROLE_MAPPING.nextreact,
  ],
  clsea957000011tx34a5zuuzl: [CODELYNX_ROLE_MAPPING.nowts],
  clti1z8gj000112j8yg8wcdpq: [
    CODELYNX_ROLE_MAPPING.nextai,
    CODELYNX_ROLE_MAPPING.nowts,
  ],
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
  "LJYv0rHqQ7P": [
    CODELYNX_ROLE_MAPPING.nextreact,
    CODELYNX_ROLE_MAPPING.beginjavascript,
    CODELYNX_ROLE_MAPPING.beginreact,

  ],
  // SaaS Bundle
  "cluryhgck0001rqsd1ji03b3r": [
    CODELYNX_ROLE_MAPPING.nextai,
    CODELYNX_ROLE_MAPPING.nextreact,
    CODELYNX_ROLE_MAPPING.nowtspro,
    CODELYNX_ROLE_MAPPING.nowts,
  ],
  // FullStack React
  "nextfullstackreact": [
    CODELYNX_ROLE_MAPPING.nextfullstack,
    CODELYNX_ROLE_MAPPING.beginreact
  ]
} as const;
