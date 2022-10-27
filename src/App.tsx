/** @ts-ignore */
import { createContext, Show, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst } from '@cn-ui/use';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
import { useDatabase } from './use/useDatabase';
import { SettingPanel } from './SettingPanel';
import { useStorage } from './use/useStorage';
import { PublicPanel } from './PublicPanel';
import { UploadPanel } from './UploadPanel';

export interface IData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
    emphasize: number;
}

export const Data = createContext<{
    deleteMode: Atom<boolean>;
    enMode: Atom<boolean>;
    emphasizeAddMode: Atom<boolean>;
    emphasizeSubMode: Atom<boolean>;
    r18Mode: Atom<boolean>;
    showCount: Atom<boolean>;
    settingVisible: Atom<boolean>;
    publicVisible: Atom<boolean>;
    uploaderVisible: Atom<boolean>;
    searchText: Atom<string>;
    username: Atom<string>;
    usersCollection: Atom<IData[]>;
    tagsPerPage: Atom<number>;
    searchNumberLimit: Atom<number>;
    result: Atom<IData[]>;
    lists: Atom<IData[]>;
}>();

export const App = () => {
    const { result, lists, searchText, usersCollection } = useDatabase();

    const enMode = atom<boolean>(true);
    const r18Mode = atom<boolean>(false);
    const settingVisible = atom<boolean>(false);
    const publicVisible = atom<boolean>(false);
    const uploaderVisible = atom<boolean>(false);
    const deleteMode = atom<boolean>(false);
    const showCount = atom<boolean>(true);
    const emphasizeAddMode = atom(false);
    const emphasizeSubMode = atom(false);
    const tagsPerPage = atom<number>(500);
    const searchNumberLimit = atom<number>(0);

    const username = atom('');

    const storageSetting = {
        enMode,
        tagsPerPage,
        r18Mode,
        settingVisible,
        deleteMode,
        showCount,
        username,
        searchNumberLimit,
    };
    const { recover, tracking } = useStorage(storageSetting);
    recover();
    tracking();
    return (
        <Data.Provider
            value={{
                publicVisible,
                usersCollection,
                result,
                lists,
                emphasizeAddMode,
                emphasizeSubMode,
                searchText,
                uploaderVisible,
                ...storageSetting,
            }}
        >
            <div class="m-auto flex h-screen w-screen max-w-7xl flex-col  p-2 text-gray-400 sm:p-4">
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
                <PublicPanel></PublicPanel>
                <UploadPanel></UploadPanel>
            </div>
        </Data.Provider>
    );
};
