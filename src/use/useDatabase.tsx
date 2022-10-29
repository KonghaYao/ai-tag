/** @ts-ignore */
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';
import { batch, createEffect, createMemo, createResource, createSignal, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import Fuse from 'fuse.js';
import { useSearchParams } from '@solidjs/router';
import { IData, IStoreData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { TagsToString } from './TagsToString';

// XLSX 有 400 多 K 非常大，所以改为 papaparse
import Papa from 'papaparse';
function CSVToJSON<T>(csv: Blob) {
    return new Promise<T[]>((res) => {
        console.time('加载 csv 文件');
        /**@ts-ignore */
        Papa.parse(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete(results, file) {
                console.timeEnd('加载 csv 文件');
                res(results.data as any);
            },
        });
    });
}

/** 加载 Tag 数据库 */
export function useDatabase(store: IStoreData) {
    const [lists] = createResource<IData[]>(() =>
        fetch('/tags.csv').then((res) =>
            res
                .blob()
                .then((res) => CSVToJSON<IData>(res))
                .then((res) => {
                    res.forEach((i) => (i.emphasize = 0));
                    return res;
                })
        )
    );

    createEffect(() => {
        usersCollection(getTagInURL(lists()));
    });

    // 预先筛选 searchText，减少需要查找的区间
    const searchText = atom<string>('');
    const { r18Mode, searchNumberLimit } = store;
    const searchInput = createMemo(() => {
        if (lists.loading) return [];
        const r18 = r18Mode();
        const numberLimit = searchNumberLimit();

        return lists().filter((i) => (r18 || !i.r18) && i.count >= numberLimit);
    });
    const query = reflect(() => {
        if (searchInput()) {
            return new Fuse(searchInput(), {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                threshold: 1,
                distance: 100,
                useExtendedSearch: true,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                // fieldNormWeight: 1,
                keys: ['cn', 'en'],
            });
        }
    });

    const result = reflect(() => {
        const text = searchText();
        if (text) {
            // 这个搜索特别慢
            console.time('搜索');
            const result = query().search(text);
            console.timeEnd('搜索');
            // console.log(result);
            const final = result.map((i) => i.item);
            return final;
        } else {
            return searchInput()?.slice(0, 300) || [];
        }
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
        console.log('写入 URL ');
    }, [usersCollection]);

    return { result, lists: searchInput, searchText, usersCollection };
}
