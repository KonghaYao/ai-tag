/** @ts-ignore */
import { createContext, Show, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst } from '@cn-ui/use';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
import { useDatabase } from './use/useDatabase';
import { SettingPanel } from './SettingPanel';
import { useStorage } from './use/useStorage';

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
    settingVisible: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<IData[]>;
    result: Atom<IData[]>;
    lists: Atom<IData[]>;
}>();

export const App = () => {
    const { result, lists, searchText, usersCollection } = useDatabase();

    const enMode = atom<boolean>(false);
    const r18Mode = atom<boolean>(false);
    const settingVisible = atom<boolean>(false);
    const deleteMode = atom<boolean>(false);
    const showCount = atom<boolean>(true);

    const storageSetting = {
        enMode,
        r18Mode,
        settingVisible,
        deleteMode,
        showCount,
    };
    const { recover, tracking } = useStorage(storageSetting);
    recover();
    tracking();
    return (
        <Data.Provider
            value={{
                usersCollection,
                result,
                lists,
                searchText,
                ...storageSetting,
            }}
        >
            <div class="flex h-screen w-screen flex-col bg-black p-4 text-gray-400">
                <h2 class="text-center text-xl font-bold">
                    AI 绘画三星法器 —— 魔导绪论
                    <a
                        href="https://github.com/KonghaYao/ai-tag"
                        target="_blank"
                        class="mx-2 text-sm text-blue-700 "
                    >
                        KongHaYao
                    </a>
                    <sup class="text-xs text-blue-700 ">{__version__}</sup>
                </h2>
                <UserSelected></UserSelected>
                <SearchBox></SearchBox>
                <SettingPanel></SettingPanel>
            </div>
        </Data.Provider>
    );
};
