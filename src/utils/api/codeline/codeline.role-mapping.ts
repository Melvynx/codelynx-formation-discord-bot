import { env } from "@/utils/env/env.util";

const CODELYNX_ROLE_MAPPING = {
  nextreact: env.NEXTREACT_ROLE_ID,
  beginreact: env.BEGINREACT_ROLE_ID,
  beginjavascript: env.BEGINJAVASCRIPT_ROLE_ID,
  nextailwind: env.NEXTAILWIND_ROLE_ID,
  nextai: env.NEXTAI_ROLE_ID,
  nowts: env.NOWTS_ROLE_ID,
  nowtspro: env.NOWTSPRO_ROLE_ID,
} as const;

type CodelynxRole = keyof typeof CODELYNX_ROLE_MAPPING;

export const CODELINE_PRODUCT_MAPPING_CODELYNX_ROLE: Record<string, CodelynxRole[]> =
  {
    cle0ad95a0001jw08hn80in2y: ["beginjavascript"],
    cld1rbuvp0003knu4nhodbbf0: ["nextreact"],
    clgq5mk240001l708k856eu52: ["beginreact"],
    clpqdoypw000313wyuc7cly2f: ["nextai"],
    clqn8pmte0001lr54itcjzl59: ["nowts"],
    clukhuak400017z3wlz6iw39r: ["nextailwind"],
  } as const;

export const CODELINE_BUNDLE_MAPPING_CODELYNX_ROLE: Record<string, CodelynxRole[]> =
  {
    clglz5oc90001me08ppf3uaeq: ["beginreact", "nextreact"],
    clldce38o0001mk08bn4i2djz: ["beginjavascript", "beginreact"],
    clldnguja0001l008g3dfqpit: ["beginjavascript", "nextreact", "beginreact"],
    clsea957000011tx34a5zuuzl: ["nowts"],
    clti1z8gj000112j8yg8wcdpq: ["nextai", "nowts"],
  } as const;
