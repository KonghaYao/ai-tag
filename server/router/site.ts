import { qs, Router } from "../deps.ts";
export const SiteRouter = new Router();
const { token, websiteId } = await fetch(
  "https://analytics.umami.is/api/share/7vG3EWy6X6ZE8B68",
  {
    headers: {
      accept: "application/json",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/json",
    },
    referrer: "https://analytics.umami.is/share/7vG3EWy6X6ZE8B68/magic-tags",
  },
).then((res) => res.json());
SiteRouter.get("/stat", async (ctx) => {
  const params = qs.parse(ctx.querystring) as any;

  const base: any = await fetch(
    `https://analytics.umami.is/api/websites/${websiteId}/stats?startAt=${params.start_at}&endAt=${params.end_at}`,
    {
      headers: {
        accept: "application/json",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "max-age=0",
        "content-type": "application/json",
        "x-umami-share-token": token,
      },
      referrer: "https://analytics.umami.is/share/7vG3EWy6X6ZE8B68/magic-tags",
    },
  ).then((res) => res.json());

  ctx.body = JSON.stringify(base);
});

SiteRouter.get("/active", async (ctx) => {
  const active = await fetch(
    "https://analytics.umami.is/api/websites/e79ecc5d-7f0b-409b-9f3c-bffc90cc1173/active",
    {
      headers: {
        accept: "application/json",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "max-age=0",
        "content-type": "application/json",
        "x-umami-share-token": token,
      },
      referrer: "https://analytics.umami.is/share/7vG3EWy6X6ZE8B68",
    },
  ).then((res) => res.json());
  ctx.body = JSON.stringify(active);
});
