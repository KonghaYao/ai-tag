import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
export const handler: Handler = async (event, content) => {
    const params = event.queryStringParameters!;

    /** @ts-ignore */
    const { token, websiteId } = await fetch(
        'https://analytics.umami.is/api/share/7vG3EWy6X6ZE8B68',
        {
            headers: {
                accept: 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
            },
            referrer: 'https://analytics.umami.is/share/7vG3EWy6X6ZE8B68/magic-tags',
        }
    ).then((res) => res.json());

    const base: any = await fetch(
        `https://analytics.umami.is/api/websites/${websiteId}/stats?start_at=${params.start_at}&end_at=${params.end_at}`,
        {
            headers: {
                accept: 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                'content-type': 'application/json',
                'x-umami-share-token': token,
            },
            referrer: 'https://analytics.umami.is/share/7vG3EWy6X6ZE8B68/magic-tags',
        }
    ).then((res) => res.json());
    const timeArea = await fetch(
        `https://analytics.umami.is/api/websites/e79ecc5d-7f0b-409b-9f3c-bffc90cc1173/pageviews?start_at=${
            params.start_at
        }&end_at=${params.end_at}&unit=${params.unit ?? 'day'}&tz=Asia%2FShanghai`,
        {
            headers: {
                accept: 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                'content-type': 'application/json',
                'x-umami-share-token': token,
            },
            referrer: 'https://analytics.umami.is/share/7vG3EWy6X6ZE8B68/magic-tags',
        }
    ).then((res) => res.json());
    const active = fetch(
        'https://analytics.umami.is/api/websites/e79ecc5d-7f0b-409b-9f3c-bffc90cc1173/active',
        {
            headers: {
                accept: 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                'content-type': 'application/json',
                'x-umami-share-token': token,
            },
            referrer: 'https://analytics.umami.is/share/7vG3EWy6X6ZE8B68',
        }
    ).then((res) => res.json());
    const data = { ...base, timeArea, active };
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
