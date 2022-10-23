/** @ts-ignore */
import { createContext, createEffect, untrack } from 'solid-js';
import { Atom, atom } from '@cn-ui/use';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
import { useSearchParams } from '@solidjs/router';
import { useDatabase } from './useDatabase';

export interface IData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
}

export const Data = createContext<{
    deleteMode: Atom<boolean>;
    enMode: Atom<boolean>;
    r18Mode: Atom<boolean>;
    showCount: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<IData[]>;
    result: Atom<IData[]>;
    lists: Atom<IData[]>;
}>();

export const getTagInURL = (lists: IData[]) => {
    const [{ tags }] = useSearchParams();
    if (!tags) return [];
    try {
        return (
            tags.split(',').map((i) => {
                return (
                    lists.find((item) => item.en === i) ??
                    ({ en: i, cn: i, r18: 0, count: Infinity } as IData)
                );
            }) ?? []
        );
    } catch (e) {
        return [];
    }
};

export const App = () => {
    const { result, lists, searchText, usersCollection } = useDatabase();

    const enMode = atom<boolean>(false);
    const r18Mode = atom<boolean>(false);
    const deleteMode = atom<boolean>(false);
    const showCount = atom<boolean>(true);
    return (
        <Data.Provider
            value={{
                deleteMode,
                enMode,
                usersCollection,
                result,
                lists,
                showCount,
                r18Mode,
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
                    <sup class="text-xs">{__version__}</sup>
                </h2>
                <UserSelected></UserSelected>
                <SearchBox></SearchBox>
            </div>
        </Data.Provider>
    );
};
