import { createEffect, createResource, createSignal, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import { useSearchParams } from '@solidjs/router';
import { IData, IStoreData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { stringToTags, TagsToString } from './TagsToString';
import { proxy } from 'comlink';
import { CSVToJSON } from '../utils/CSVToJSON';
import { initWorker } from '../worker';
const { searchWorker, sharedWorker } = initWorker();
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
        return fetch('https://cdn.jsdelivr.net/gh/konghayao/tag-collection/data/tags.csv').then(
            (res) =>
                res
                    .blob()
                    .then((res) => CSVToJSON<IData>(res))
                    .then(async (res) => {
                        // <200 ms 可以被接受
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

    // 将 usersCollection 推向标签栏
    createIgnoreFirst(() => {
        const tags = TagsToString(usersCollection());
        setSearchParams(
            {
                ...untrack(() => searchParams),
                tags,
            },
            {}
        );
    }, [usersCollection]);

    let stateTag = '';
    // 监听 URL 地址变化
    createIgnoreFirst(async () => {
        const tags = searchParams.tags;
        if (stateTag === tags) return;
        stateTag = tags;

        // console.log('url => ', tags);
        const urlTags = getTagInURL(lists());

        // 载入 URL 中的 Prompt
        usersCollection(urlTags);
        await sharedWorker.changeData({
            prompt: tags,
        });
    }, [() => searchParams.tags]);

    // 初始化 usersCollection
    const initUsersCollection = async () => {
        const tags = searchParams.tags ?? '';
        if (stateTag === tags) return;
        stateTag = tags;

        const urlTags = getTagInURL(lists());
        if (!urlTags?.length) {
            await sharedWorker.getData().then((data) => {
                if (data.prompt) usersCollection(stringToTags(data.prompt, untrack(lists)));
            });
            return;
        } else {
            usersCollection(urlTags);
            await sharedWorker.changeData({
                prompt: tags,
            });
        }
    };
    untrack(initUsersCollection);
    sharedWorker.onUpdate(
        proxy(({ prompt = '' }) => {
            if (prompt !== stateTag) {
                // 如果用户输入在 URL 的 tag 不太规范，会震荡数据将其统一
                console.log('触发检查', { receive: prompt, stateTag }, prompt === stateTag);
                stateTag = prompt;
                usersCollection(stringToTags(prompt, untrack(lists)));
            }
        })
    );
    return { result, lists: safeList, searchText, usersCollection };
}
