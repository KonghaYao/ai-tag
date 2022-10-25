/** @ts-ignore */
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';
import { createEffect, createMemo, createResource, createSignal, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import Fuse from 'fuse.js';
import { useSearchParams } from '@solidjs/router';
import { IData } from '../App';
import { getTagInURL } from '../utils/getTagInURL';
import { stringToTagData } from '../utils/stringToTags';
export const stringToTags = (s: string, list: IData[]): IData[] => {
    const data = stringToTagData(s);
    // console.log(data, s);
    return data.map((i) => {
        const en = list.find((it) => i.text === it.en);
        if (en) return { ...en, emphasize: i.emphasize };
        const cn = list.find((it) => i.text === it.cn);
        if (cn) return { ...cn, emphasize: i.emphasize };
        return {
            en: i.text,
            cn: i.text,
            count: Infinity,
            r18: 0,
            emphasize: i.emphasize,
        };
    });
};
export const TagsToString = (data: IData[], en = true) => {
    return data
        .map((i) => {
            return '{'.repeat(i.emphasize) + (en ? i.en : i.cn) + '}'.repeat(i.emphasize);
        })
        .join(',');
};

export function useDatabase() {
    const [data] = createResource<ArrayBuffer>(() =>
        fetch('/tags.csv').then((res) => res.arrayBuffer())
    );
    const lists = reflect<IData[]>(() => {
        if (data()) {
            const workbook = XLSX.read(data());
            const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            json.forEach((i) => (i.emphasize = 0));
            // 防止重复渲染
            untrack(() => {
                usersCollection(getTagInURL(json));
            });
            return json;
        }
    });
    const query = reflect(() => {
        if (lists()) {
            return new Fuse(lists(), {
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
    const searchText = atom<string>('');
    const result = reflect(() => {
        const text = searchText();
        if (text) {
            const result = query().search(text);
            // console.log(result);
            return result.map((i) => i.item);
        } else {
            return lists()?.slice(0, 300) || [];
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

    return { result, lists, searchText, usersCollection };
}
