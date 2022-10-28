/** @ts-ignore */
import { Accessor, createContext, createSelector, Show, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst } from '@cn-ui/use';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
import { useDatabase } from './use/useDatabase';
import { useStorage } from './use/useStorage';
import { PanelIds, SideApp } from './SideApp';

export interface IData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
    emphasize: number;
}
export interface IStoreData {
    deleteMode: Atom<boolean>;
    visibleId: Atom<string>;
    enMode: Atom<boolean>;
    r18Mode: Atom<boolean>;
    showCount: Atom<boolean>;
    searchNumberLimit: Atom<number>;
    tagsPerPage: Atom<number>;
    username: Atom<string>;
}
export interface IGlobalData extends IStoreData {
    emphasizeAddMode: Atom<boolean>;
    emphasizeSubMode: Atom<boolean>;
    sideAppMode: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<IData[]>;
    result: Atom<IData[]>;
    lists: Accessor<IData[]>;
    isPanelVisible: (key: PanelIds) => boolean;
}
export const Data = createContext<IGlobalData>();
import isMobile from 'is-mobile';
export const App = () => {
    const enMode = atom<boolean>(true);
    const r18Mode = atom<boolean>(false);
    const sideAppMode = atom<boolean>(!isMobile());
    const deleteMode = atom<boolean>(false);
    const showCount = atom<boolean>(true);
    const emphasizeAddMode = atom(false);
    const emphasizeSubMode = atom(false);
    const tagsPerPage = atom<number>(500);
    const searchNumberLimit = atom<number>(1000);
    const visibleId = atom<PanelIds | ''>('');
    const isPanelVisible = createSelector(visibleId);
    const username = atom('');

    const storageSetting = {
        enMode,
        tagsPerPage,
        r18Mode,
        deleteMode,
        showCount,
        username,
        searchNumberLimit,
        visibleId,
    };
    const { result, lists, searchText, usersCollection } = useDatabase(storageSetting);
    const { recover, tracking } = useStorage(storageSetting);
    recover();
    tracking();

    return (
        <Data.Provider
            value={{
                isPanelVisible,
                usersCollection,
                sideAppMode,
                result,

                lists,
                emphasizeAddMode,
                emphasizeSubMode,
                searchText,
                ...storageSetting,
            }}
        >
            <div class="flex h-screen w-screen justify-center">
                <main class=" flex h-full w-full max-w-4xl flex-col overflow-hidden  p-2 text-gray-400 sm:p-4">
                    <h2 class="text-center text-xl font-bold">
                        AI 绘画三星法器 —— 魔导绪论
                        <sup class="px-2 text-xs text-yellow-300">{__version__}</sup>
                        <div class="flex items-center  justify-center gap-2 text-xs font-thin text-[#f5f3c2]">
                            <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                教程
                            </a>
                            ·
                            <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                开源
                            </a>
                            ·
                            <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                {'{{ By 江夏尧 }}'}
                            </a>
                            {!r18Mode() && <span class="btn bg-green-700">青少年模式</span>}
                        </div>
                    </h2>
                    <UserSelected></UserSelected>
                    <SearchBox></SearchBox>
                </main>

                <SideApp></SideApp>
            </div>
        </Data.Provider>
    );
};
