import { Client } from 'notion-web/dist/index';
import { fetchWithAgent } from './fetchWithAgent';
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
// Notion 的 Text 格式生成器
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
            fetch: fetchWithAgent as any,
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
            cover: {
                external: { url: data.image },
                type: 'external',
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
