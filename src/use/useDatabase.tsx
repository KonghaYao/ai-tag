/** @ts-ignore */
import { createEffect, createResource, createSignal, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import { useSearchParams } from '@solidjs/router';
import { IData, IStoreData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { stringToTags, TagsToString } from './TagsToString';
import { proxy, wrap } from 'comlink';
import { CSVToJSON } from '../utils/CSVToJSON';
import { SharedDataAPI } from '../worker/dataShared';

// 初始化搜索 worker
const searchWorker = wrap<{
    init: (input: IData[]) => Promise<void>;
    rebuild: (a: { r18: boolean; numberLimit: number }) => Promise<true>;
    search: (a: { text: string; limit: number }) => Promise<number[]>;
}>(
    new SharedWorker(new URL('../worker/searchWorker', import.meta.url), {
        type: 'module',
    }).port
);

const sharedWorker = wrap<SharedDataAPI>(
    new SharedWorker(new URL('../worker/dataShared', import.meta.url), {
        type: 'module',
    }).port
);

/** 加载 Tag 数据库 */
export function useDatabase(store: IStoreData) {
    console.log('重绘');
    const rebuildSearchSet = async () => {
        if (lists.loading) return [];
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();
        await searchWorker.rebuild({ r18, numberLimit });
    };
    const [lists] = createResource<IData[]>(async () => {
        return fetch('/tags.csv', { cache: 'force-cache' }).then((res) =>
            res
                .blob()
                .then((res) => CSVToJSON<IData>(res))
                .then(async (res) => {
                    // <100 ms 可以被接收
                    console.time('初始化线程');
                    await searchWorker.init(res);
                    console.timeEnd('初始化线程');
                    await rebuildSearchSet();
                    return res;
                })
                .then((res) => {
                    res.forEach((i) => (i.emphasize = 0));
                    return res;
                })
        );
    });

    // 预先筛选 searchText，减少需要查找的区间
    const searchText = atom<string>('');
    const { r18Mode, searchNumberLimit, tagsPerPage } = store;
    createEffect(rebuildSearchSet);

    const result = atom<IData[]>([]);

    /** 安全的数据列表，对外提供操作 */
    const safeList = reflect(() => {
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();

        return lists()?.filter((i) => (r18 || !i.r18) && i.count >= numberLimit) ?? [];
    });

    createEffect(async () => {
        if (!lists()) result([]);
        const text = searchText();
        if (!text) {
            result(safeList().slice(0, tagsPerPage()));
            return;
        }
        console.time('搜索');
        // 返回形式为数组，所以非常快
        const r = await searchWorker.search({ text, limit: tagsPerPage() });
        console.timeEnd('搜索');
        const data = lists();
        result(r.map((i) => data[i]));
    });

    const [U, setU] = createSignal<IData[]>([]);
    // 添加去重功能，但是实现极其不行
    /** @ts-ignore */
    const usersCollection: Atom<IData[]> = (...args) => {
        if (args.length === 0) {
            return U();
        } else {
            let [data] = args;
            if (typeof data === 'function') {
                data = data(U());
            }
            data = data.filter((i) => i);
            return setU(
                data.filter(
                    (item, index) =>
                        (data as IData[]).findIndex((next) => next.en === item.en) === index
                )
            );
        }
    };
    const [searchParams, setSearchParams] = useSearchParams();

    createIgnoreFirst(() => {
        const tags = TagsToString(usersCollection());
        setSearchParams(
            {
                ...untrack(() => searchParams),
                tags,
            },
            { replace: true, resolve: false }
        );
        // console.log('写入 URL ');
    }, [usersCollection]);

    let stateTag = untrack(() => searchParams.tags) ?? '';
    createEffect(async () => {
        const urlTags = getTagInURL(lists());
        if (urlTags?.length) {
            usersCollection(urlTags);
            await sharedWorker.changeData({
                prompt: untrack(() => searchParams.tags),
            });
        } else {
            await sharedWorker.getData().then((data) => {
                if (data.prompt) usersCollection(stringToTags(data.prompt));
            });
        }
    });
    sharedWorker.onUpdate(
        proxy((data) => {
            if (data.prompt && data.prompt !== stateTag) {
                stateTag = data.prompt;
                usersCollection(stringToTags(data.prompt));
            }
        })
    );
    return { result, lists: safeList, searchText, usersCollection };
}
