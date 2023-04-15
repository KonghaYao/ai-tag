import { MeiliSearch, qs, Router } from "../deps.ts";
import MeiliConfig from "../.env_code/meiliConfig.json" assert { type: "json" };
import { RandomPick } from "./RandomPick.ts";

const tagsRouter = new Router();

// Meilisearch 是分布式的结构😂
const clientPool = MeiliConfig.map((i) => {
  return new MeiliSearch(i);
});

// 搜索词汇的路由
tagsRouter.get("/search", async (ctx) => {
  const data = qs.parse(ctx.querystring);
  const api = RandomPick(clientPool);
  const res = await api.index("tags").search(data.text as string, {
    limit: 50,
    ...(data?.options as any ?? {}),
  });
  ctx.set("Cache-Control", "public, max-age=86400, s-maxage=3600");
  ctx.body = JSON.stringify(res);
});
tagsRouter.get("/search/stat", async (ctx) => {
  const res = await Promise.all(clientPool.map((i) => i.getStats()));
  ctx.body = JSON.stringify(res);
});
export { tagsRouter };
