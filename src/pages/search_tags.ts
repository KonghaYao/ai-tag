import type { APIRoute } from 'astro';
import { MeiliSearch } from 'meilisearch';
const clientPool = [
    {
        host: 'https://able-hare-95.deno.dev',

        // search Key
        apiKey: '3e0253ea1ff3c28ce7d78e35762427ab2ca9c78e0830ad2d6d9b96ba820541dd',
    },
].map((i) => {
    return new MeiliSearch(i);
});
const pick = <T>(arr: Array<T>) => arr[Math.floor(arr.length * Math.random())];

export const post: APIRoute = async ({ request }) => {
    const data = await request.json();
    //  console.log(data);
    if (typeof data.text === 'string') {
        const res = await pick(clientPool).index('tags').search(data.text, { limit: 50 });
        return {
            body: JSON.stringify(res),
        };
    } else {
        return new Response('', { status: 404 });
    }
};
