import type { Queriable, Query } from 'leancloud-storage';
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
export const API = {
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
        r18 === false && q.equalTo('r18', false);
        query && query(q);
        return q
            .limit(10)
            .skip(index * 10)
            .find()
            .then((res) => res.map((i) => i.toJSON()))
            .then((res) => {
                // console.log(res);
                this.end = res.length === 0;
                return res as StoreData[];
            });
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
