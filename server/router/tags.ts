import { Application, Router, helpers } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import { RandomPick } from "./RandomPick.ts";
import MeiliSearch from "https://esm.sh/meilisearch@0.32.0";

const tagsRouter = new Router();

// Meilisearch 是分布式的结构😂
const clientPool = [{
    
        host: Deno.env.get("MEILISEARCH_HOST"),
        apiKey: Deno.env.get("MEILISEARCH_API_KEY"),
      
}].map((i) => {
    return new MeiliSearch(i);
});

// 搜索词汇的路由
tagsRouter.get("/search", async (ctx) => {
    const data = helpers.getQuery(ctx);
    const api = RandomPick(clientPool);
    const res = await api.index("tags").search(data.text as string, {
        limit: 50,
        ...(data?.options as any ?? {}),
    });
    ctx.response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=3600");
    ctx.response.body = JSON.stringify(res);
});

// 服务器状况
tagsRouter.get("/search/stat", async (ctx) => {
    const res = await Promise.all(clientPool.map((i) => i.getStats()));
    ctx.response.body = JSON.stringify(res);
});
export { tagsRouter };
