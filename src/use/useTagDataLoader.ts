import { createEffect } from 'solid-js';
import { resource } from '@cn-ui/use';
import type { ITagData, IStoreData } from '../app/main/App';
import { CSVToJSON } from '../utils/CSVToJSON';
import { cdn } from '../store/useGlobalTags';
import { searchWorker } from './searchWorker';

/** 用于初始化线程和 TAG 数据加载 */

export const useTagDataLoader = (store: IStoreData) => {
    const { r18Mode, searchNumberLimit, tag_version } = store;
    const rebuildSearchSet = () => {
        if (!lists.isReady()) return [];
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();
        return searchWorker.rebuild({ r18, numberLimit });
    };
    const lists = resource<ITagData[]>(
        async () => {
            return fetch(cdn + `/tag-collection@${tag_version()}/data/split/small.csv`)
                .then((res) => res.blob())
                .then((res) => CSVToJSON<ITagData>(res))
                .then(async (res) => {
                    // <200 ms 可以被接受
                    console.time('初始化线程');
                    await searchWorker.init(res);
                    console.timeEnd('初始化线程');
                    await rebuildSearchSet();
                    return res;
                })
                .then((res) => {
                    // 添加缺失的属性,只在 UI 展示有用
                    res.forEach((i) => (i.emphasize = 0));

                    return res;
                });
        },
        { initValue: [] }
    );
    createEffect(() => {
        lists.isReady() &&
            [...Array(5).keys()]
                .reduce((col, i) => {
                    return col.then(() =>
                        fetch(cdn + `/tag-collection@${tag_version()}/data/split/bigger_${i}.csv`)
                            .then((res) => res.blob())
                            .then((res) => CSVToJSON<ITagData>(res))
                            .then(async (res) => {
                                // <200 ms 可以被接受
                                await searchWorker.add(res);
                                await rebuildSearchSet();
                                return res;
                            })
                            .then((res) => {
                                // 添加缺失的属性,只在 UI 展示有用
                                res.filter((i) => i).forEach((i) => (i.emphasize = 0));
                                lists((i) => [...i, ...res].sort((a, b) => b.count - a.count));
                            })
                    );
                }, Promise.resolve())
                .then(() => {
                    console.log('数据全部更新完成');
                });
    });
    return { lists, rebuildSearchSet };
};
