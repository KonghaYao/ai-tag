/** @ts-ignore */
import { createEffect, createResource, createSignal, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst } from '@cn-ui/use';
import { useSearchParams } from '@solidjs/router';
import { IData, IStoreData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { TagsToString } from './TagsToString';
import { wrap } from 'comlink';
import { CSVToJSON } from '../utils/CSVToJSON';

// 初始化搜索 worker
const worker = new Worker(new URL('../worker/searchWorker', import.meta.url), { type: 'module' });
const searchWorker = wrap<{
    init: (input: IData[]) => Promise<void>;
    rebuild: (a: { r18: boolean; numberLimit: number }) => Promise<true>;
    search: (a: { text: string; limit: number }) => Promise<number[]>;
}>(worker);

/** 加载 Tag 数据库 */
export function useDatabase(store: IStoreData) {
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

    createEffect(() => usersCollection(getTagInURL(lists())));

    // 预先筛选 searchText，减少需要查找的区间
    const searchText = atom<string>('');
    const { r18Mode, searchNumberLimit, tagsPerPage } = store;
    createEffect(rebuildSearchSet);

    const result = atom<IData[]>([]);

    createEffect(async () => {
        if (!lists()) result([]);
        const text = searchText();
        if (!text) {
            const r18 = untrack(r18Mode);
            const numberLimit = untrack(searchNumberLimit);

            const r =
                lists()
                    ?.filter((i) => (r18 || !i.r18) && i.count >= numberLimit)
                    ?.slice(0, tagsPerPage()) ?? [];
            result(r);
            return;
        }
        // 这个搜索特别慢
        console.time('搜索');
        const r = await searchWorker.search({ text, limit: tagsPerPage() });
        console.timeEnd('搜索');
        const data = lists();
        const final = r.map((i) => data[i]);
        result(final);
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

    return { result, lists, searchText, usersCollection };
}
