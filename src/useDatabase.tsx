import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';
import { createResource } from 'solid-js';
import { atom, createIgnoreFirst, reflect } from '@cn-ui/use';
import Fuse from 'fuse.js';
import { useSearchParams } from '@solidjs/router';
import { IData, getTagInURL } from './App';

export function useDatabase() {
    const [data] = createResource<ArrayBuffer>(() =>
        fetch('/tags.csv').then((res) => res.arrayBuffer())
    );
    const lists = reflect<IData[]>(() => {
        if (data()) {
            const workbook = XLSX.read(data());
            const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            usersCollection(getTagInURL(json));
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
            return lists()?.slice(0, 100) || [];
        }
    });
    const usersCollection = atom<IData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    createIgnoreFirst(() => {
        const tags = usersCollection()
            .map((i) => i.en)
            .join(',');

        // TODO 会造成卡顿
        // setSearchParams(
        //     {
        //         ...untrack(() => searchParams),
        //         tags,
        //     },
        //     { replace: true, resolve: false }
        // );
    }, [usersCollection]);

    return { result, lists, searchText, usersCollection };
}
