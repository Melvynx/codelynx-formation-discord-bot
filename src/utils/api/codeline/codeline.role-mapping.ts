const CODELYNX_ROLE_MAPPING = {
  nextreact: "1064856583890272346",
  beginreact: "967848790381957180",
  beginjavascript: "1120211271904657452",
  nextailwind: "1231901827902083132",
  nextai: "1183988491525308536",
  nowts: "1204670788058488882",
  nowtspro: "1204671028064681986",
} as const;

type CodelynxRole = keyof typeof CODELYNX_ROLE_MAPPING;

export const CODELINE_PRODUCT_MAPPING_CODELYNX_ROLE: Record<
  string,
  CodelynxRole[]
> = {
  cle0ad95a0001jw08hn80in2y: ["beginjavascript"],
  cld1rbuvp0003knu4nhodbbf0: ["nextreact"],
  clgq5mk240001l708k856eu52: ["beginreact"],
  clpqdoypw000313wyuc7cly2f: ["nextai"],
  clqn8pmte0001lr54itcjzl59: ["nowts"],
  clukhuak400017z3wlz6iw39r: ["nextailwind"],
} as const;

export const CODELINE_BUNDLE_MAPPING_CODELYNX_ROLE: Record<
  string,
  CodelynxRole[]
> = {
  clglz5oc90001me08ppf3uaeq: ["beginreact", "nextreact"],
  clldce38o0001mk08bn4i2djz: ["beginjavascript", "beginreact"],
  clldnguja0001l008g3dfqpit: ["beginjavascript", "nextreact", "beginreact"],
  clsea957000011tx34a5zuuzl: ["nowts"],
  clti1z8gj000112j8yg8wcdpq: ["nextai", "nowts"],
} as const;
