import { createDeferred, createEffect, createSignal, untrack } from 'solid-js';
import { Atom, atom, reflect, resource } from '@cn-ui/use';
import { useSearchParams } from '@solidjs/router';
import { IData, IStoreData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { stringToTags } from './TagsConvertor';
import { proxy } from 'comlink';
import { CSVToJSON } from '../utils/CSVToJSON';
import { initWorker } from '../worker';
import { addUnknownReporter, addUnknowns } from '../utils/UnKnowReporter';
import { useHistory } from './useTagHistory';
const { searchWorker, sharedWorker } = initWorker();

/** 用于初始化线程和 TAG 数据加载 */
export const useTagDataLoader = (store: IStoreData) => {
    const { r18Mode, searchNumberLimit, tag_version } = store;
    const rebuildSearchSet = () => {
        if (!lists.isReady()) return [];
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();
        return searchWorker.rebuild({ r18, numberLimit });
    };
    const lists = resource<IData[]>(async () => {
        return fetch(`https://unpkg.com/tag-collection@${tag_version()}/data/split/small.csv`)
            .then((res) => res.blob())
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
                // 添加缺失的属性,只在 UI 展示有用
                res.forEach((i) => (i.emphasize = 0));

                return res;
            });
    }, []);
    createEffect(() => {
        lists.isReady() &&
            [...Array(5).keys()]
                .reduce((col, i) => {
                    return col.then(() =>
                        fetch(
                            `https://unpkg.com/tag-collection@${tag_version()}/data/split/bigger_${i}.csv`
                        )
                            .then((res) => res.blob())
                            .then((res) => CSVToJSON<IData>(res))
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

/** 加载 Tag 数据库 */
export function useDatabase(store: IStoreData) {
    console.log('重绘');
    const { lists, rebuildSearchSet } = useTagDataLoader(store);

    // 预先筛选 searchText，减少需要查找的区间
    const searchText = atom<string>('');
    const { r18Mode, searchNumberLimit, tagsPerPage } = store;
    createEffect(rebuildSearchSet);

    /** 筛选过后的数组 */
    const result = atom<IData[]>([]);

    /** 安全的数据列表，对外提供操作 */
    const safeList = reflect(() => {
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();

        return lists()?.filter((i) => (r18 || !i.r18) && i.count >= numberLimit) ?? [];
    });

    createEffect(async () => {
        if (!lists.isReady()) result([]);
        const text = searchText();
        if (!text) {
            result(safeList().slice(0, tagsPerPage()));
            return;
        }
        console.time('搜索');
        // 返回形式为 Index 数组，所以非常快
        const r = await searchWorker.search({ text, limit: tagsPerPage() });
        console.timeEnd('搜索');

        const data = lists();
        const allData = r.map((i) => data[i]);
        // console.log(allData);
        result(allData);
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
            return setU(
                data.filter(
                    (item: IData, index: number) =>
                        item &&
                        (item.text === '\n' ||
                            (data as IData[]).findIndex((next) => next.en === item.en) === index)
                )
            );
        }
    };

    // 汇报未知的单词
    // TODO 测试阶段
    addUnknownReporter(lists, usersCollection);
    const [searchParams] = useSearchParams();

    // ! 不再将 usersCollection 推向标签栏，因为这个是给用户分享用的，用完第一次就不需要了
    // 持续更新到标签栏反而耗费性能，所以只在分享 URL 的时候进行一个生成即可。

    let stateTag = '';

    // 初始化 usersCollection
    const initUsersCollection = async () => {
        const tags = searchParams.tags ?? '';
        if (stateTag === tags) return;
        stateTag = tags;

        // URL > Shared Worker
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
                console.log('Worker 注入数据');
                stateTag = prompt;
                usersCollection(stringToTags(prompt, untrack(lists)));
            }
        })
    );

    const TagsHistory = useHistory<string>();
    return { result, lists: safeList, searchText, usersCollection, TagsHistory };
}
