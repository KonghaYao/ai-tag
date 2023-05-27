import { qs, Router } from "../deps.ts";

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
const PromptStoreRouter = new Router();

console.log(Deno.env.get("POSTGRES_URL"));
const client = new Client(
  Deno.env.get("POSTGRES_URL"),
);
export const init = async () => {
  await client.connect();
};

const getLengthSQL = (name: string) => {
  switch (name) {
    case "veryshort":
      return "and length(prompt)<100 ";
    case "short":
      return "and length(prompt)<200 and length(prompt)>=100";
    case "mid":
      return "and length(prompt)<300 and length(prompt)>=200";
    case "long":
      return "and length(prompt)<400 and length(prompt)>=300";
    case "verylong":
      return "and length(prompt)>=400";

    default:
      return "";
  }
};

// 搜索词汇
PromptStoreRouter.get("/search", async (ctx) => {
  const data = qs.parse(ctx.querystring);

  const res = await client.queryObject({
    text:
      `select prompt from prompts where fts @@ to_tsquery($2) and  type = $1  ${
        getLengthSQL(data.length as string)
      } limit $3 offset $4 ; `,
    args: [data.type ?? "1", data.q, data.limit ?? "5", data.offset ?? "0"],
  });

  ctx.set("Cache-Control", "public, max-age=86400, s-maxage=3600");
  ctx.body = JSON.stringify(res.rows);
});

// 随机 prompt
PromptStoreRouter.get("/random", async (ctx) => {
  const data = qs.parse(ctx.querystring);
  const res = await client
    .queryObject`SELECT prompt FROM prompts WHERE type = ${
    data.type ?? 1
  } and id>${Math.floor(Math.random() * 1500000)} limit 5`;
  ctx.body = JSON.stringify(res.rows);
});
export { PromptStoreRouter };
