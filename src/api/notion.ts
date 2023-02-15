// import { Client } from 'notion-web/dist/index';
// import { fetchWithAgent } from './fetchWithAgent';
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
import { Queriable, Query } from 'leancloud-storage';
import { AV } from '../api/cloud';
export type StoreData = {
    username: string;
    tags: string;
    r18: boolean;
    image: string;
    description: string;
    seed?: string;
    /** 图片信息抽取 */
    other?: string;
    size: string;
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
    database_id: '90b7c1bb6ad7446ba66e0b1d8ec1d535',

    // 这次查询的列表 cursor
    start_cursor: [] as string[],
    end: false,
    async getData(
        index: number,
        r18 = false,
        query?: (Q: Query<Queriable>) => void
    ): Promise<StoreData[]> {
        const q = new AV.Query('gallery');
        q.addDescending('create_time');
        q.equalTo('r18', r18);
        query && query(q);
        return q
            .limit(10)
            .skip(index * 10)
            .find()
            .then((res) => res.map((i) => i.toJSON()))
            .then((res) => {
                console.log(res);
                this.end = res.length === 0;
                return res as StoreData[];
            });

        // if (clear) this.start_cursor = [];
        // if (this.end && index === this.start_cursor.length + 1) return [];
        // const params = {
        //     database_id: this.database_id,
        //     page_size: 10,
        //     filter: {
        //         and: [
        //             !r18 && {
        //                 property: 'r18',
        //                 checkbox: {
        //                     equals: false,
        //                 },
        //             },
        //             ...filters,
        //         ].filter((i) => i),
        //     },
        //     sorts: [
        //         {
        //             property: 'Last edited time',
        //             direction: 'descending',
        //         },
        //     ],
        // };
        // const start_cursor = this.start_cursor[index - 1];
        // /**@ts-ignore */ // 在交给云函数过程中，不能有 undefined 值
        // if (start_cursor) params.start_cursor = start_cursor;

        // return fetch('./.netlify/functions/notion_get?data=' + JSON.stringify(params))
        //     .then((res) => res.json())
        //     .then((res) => {
        //         this.end = !res.has_more;
        //         this.start_cursor[index] = res.next_cursor;
        //         // console.log(res);
        //         return res;
        //     })
        //     .then(treeToArray)
        //     .then((arr) => {
        //         /**@ts-ignore */
        //         return arr.map<StoreData[]>((i) => {
        //             return {
        //                 ...i,
        //                 description: i.description[0]?.plain_text,
        //                 username: i.username[0]?.plain_text,
        //                 tags: i.tags[0]?.plain_text,
        //                 seed: i.seed[0]?.plain_text,
        //                 other: i.other[0]?.plain_text,
        //                 size: i.size.name,
        //             };
        //         });
        //     });
    },
    async uploadData(data: StoreData) {
        const it = new AV.Object('gallery');
        Object.entries(data).forEach((i) => {
            it.set(...i);
        });
        it.set('create_time', new Date());
        return it.save();
    },
};
