/** @ts-ignore */
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';
import { createContext, createResource } from 'solid-js';
import { Atom, atom, reflect } from '@cn-ui/use';
import Fuse from 'fuse.js';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
export const Data = createContext<{
    deleteMode: Atom<boolean>;
    enMode: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<{ en: string; cn: string }[]>;
    result: Atom<{ en: string; cn: string }[]>;
    lists: Atom<{ en: string; cn: string }[]>;
}>();

export const App = () => {
    const [data] = createResource<ArrayBuffer>(() =>
        fetch('/tags.csv').then((res) => res.arrayBuffer())
    );
    const lists = reflect<{ cn: string; en: string }[]>(() => {
        if (data()) {
            const workbook = XLSX.read(data());
            const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
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
    const usersCollection = atom<{ cn: string; en: string }[]>([]);
    const enMode = atom<boolean>(false);
    const deleteMode = atom<boolean>(false);
    return (
        <Data.Provider
            value={{
                deleteMode,
                enMode,
                usersCollection,
                result,
                lists,
                searchText,
            }}
        >
            <div class="flex h-screen w-screen flex-col bg-black p-4 text-gray-400">
                <h2 class="text-center text-xl font-bold">
                    AI 绘画三星法器 —— 魔导绪论
                    <a
                        href="https://github.com/KonghaYao/ai-tag"
                        target="_blank"
                        class="mx-2 text-sm"
                    >
                        KongHaYao
                    </a>
                </h2>
                <UserSelected></UserSelected>
                <SearchBox></SearchBox>
            </div>
        </Data.Provider>
    );
};
