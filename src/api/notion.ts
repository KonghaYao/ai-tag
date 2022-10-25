import { Client } from 'notion-web/dist/index';

const fetchWithAgent = (url: string, options?: RequestInit) => {
    console.log(url, options);
    const params = new URLSearchParams();
    params.set('url', url.toString());
    if (options) {
        const headers = `method='Post',config.body=\`${options.body}\`,{${Object.entries(
            options.headers
        )
            .map(([key, value]) => `"${key}":"${value}"`)
            .join(',')}}`;
        options.body = JSON.stringify({
            url: url.toString(),
            headers,
        });
        options.headers = {
            'content-type': 'application/json',
        };
    }
    return fetch('https://bird.ioliu.cn/v2', options);
};
/** 解构 notion 的 数据列表 */
const treeToArray = (data) => {
    return data.results.map((i) =>
        Object.entries(i.properties).reduce((col, [key, value]) => {
            /** @ts-ignore  */
            col[key] = value[value.type];
            return col;
        }, {})
    );
};

export type StoreData = {
    username: string;
    tags: string[];
    r18: boolean;
    image: string;
    description: string;
    origin_tags: string;
};
const NotionText = (text: string, prop?: string) => {
    prop = prop ?? 'rich_text';
    return {
        type: prop,
        [prop]: [
            {
                type: 'text',
                text: {
                    content: text,
                },
            },
        ],
    };
};
export const API = {
    client: null as null | Client,
    database_id: '90b7c1bb6ad7446ba66e0b1d8ec1d535',
    init() {
        // Initializing a client
        this.client = new Client({
            auth: 'secret_HUtTw6zxXXR4KjLk63NaU8ZbNZc77KYM4c6PQd5ODp0',
            fetch: fetchWithAgent,
        });
    },
    start_cursor: [] as string[],
    end: false,
    async getData(index: number): Promise<StoreData[]> {
        return await this.client.databases
            .query({
                database_id: this.database_id,
                start_cursor: this.start_cursor[index - 1] ?? undefined,
            })
            .then((res) => {
                this.end = !res.has_more;
                this.start_cursor[index] = res.next_cursor;
                return res;
            })
            .then(treeToArray)
            .then((arr) => {
                console.log('notion', arr);
                /**@ts-ignore */
                return arr.map<StoreData[]>((i) => {
                    return {
                        ...i,
                        description: i.description[0]?.plain_text,
                        username: i.username[0]?.plain_text,
                        origin_tags: i.origin_tags[0]?.plain_text,

                        tags: i.tags.map((i) => i.name),
                    };
                });
            });
    },
    async uploadData(data: StoreData) {
        return this.client.pages.create({
            parent: {
                type: 'database_id',
                database_id: '90b7c1bb6ad7446ba66e0b1d8ec1d535',
            },
            properties: {
                tags: {
                    type: 'multi_select',
                    multi_select: data.tags.map((i) => ({
                        name: i,
                    })),
                },
                description: NotionText(data.description),
                image: { type: 'url', url: data.image },
                r18: { type: 'checkbox', checkbox: data.r18 },

                username: NotionText(data.username, 'title'),
                origin_tags: NotionText(data.origin_tags),
            },
        });
    },
};
