/** @ts-ignore */
import { Accessor, createContext, createEffect, createSelector, Show, untrack } from 'solid-js';
import { Atom, atom, createIgnoreFirst } from '@cn-ui/use';
import { SearchBox } from './SearchBox';
import { UserSelected } from './UserSelected';
import { useDatabase } from './use/useDatabase';
import { useStorage } from './use/useStorage';
import { PanelIds, SideApp } from './SideApp';

export interface IData extends IPromptData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
}
export interface IStoreData {
    deleteMode: Atom<boolean>;
    visibleId: Atom<string>;
    enMode: Atom<boolean>;
    r18Mode: Atom<boolean>;
    showCount: Atom<boolean>;
    searchNumberLimit: Atom<number>;
    tagsPerPage: Atom<number>;
    MaxEmphasize: Atom<number>;
    username: Atom<string>;
    webviewURL: Atom<string>;
    emphasizeSymbol: Atom<string>;
    defaultFont: Atom<boolean>;
}
export interface IGlobalData extends IStoreData {
    emphasizeAddMode: Atom<boolean>;
    emphasizeSubMode: Atom<boolean>;
    sideAppMode: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<IData[]>;
    result: Atom<IData[]>;
    lists: Accessor<IData[]>;
}
export const Data = createContext<IGlobalData>();
import isMobile from 'is-mobile';
import { useWindowResize } from './use/useWindowResize';
import { IPromptData } from 'promptor';
import { PanelContext } from './components/Panel';
import { FontSupport } from './components/FontSupport';
import { useTranslation } from '../i18n';
import { Notice } from './utils/notice';
export const App = () => {
    const enMode = atom(true);
    const r18Mode = atom(false);
    const sideAppMode = atom(!isMobile());
    const showCount = atom(true);
    const deleteMode = atom(false);
    const defaultFont = atom(false);
    const emphasizeAddMode = atom(false);
    const emphasizeSubMode = atom(false);
    const emphasizeSymbol = atom('{}');
    const tagsPerPage = atom<number>(500);
    const MaxEmphasize = atom<number>(10);
    const searchNumberLimit = atom<number>(1000);
    const webviewURL = atom('');
    const visibleId = atom<PanelIds | ''>('');
    const isPanelVisible = createSelector(visibleId);
    const username = atom('');

    /** 需要持久化的变量写这里 */
    const storageSetting = {
        emphasizeAddMode,
        emphasizeSubMode,
        emphasizeSymbol,
        enMode,
        tagsPerPage,
        r18Mode,
        deleteMode,
        showCount,
        username,
        searchNumberLimit,
        visibleId,
        webviewURL,
        MaxEmphasize,
        defaultFont,
    };
    const { result, lists, searchText, usersCollection } = useDatabase(storageSetting);
    const { recover, tracking } = useStorage(storageSetting);
    const { t } = useTranslation();
    const { width } = useWindowResize();
    // 自动变换 SideAPP 状态
    createEffect(() => sideAppMode(width() > 888));
    recover();
    tracking();
    return (
        <Data.Provider
            value={{
                usersCollection,
                sideAppMode,
                result,

                lists,
                searchText,
                ...storageSetting,
            }}
        >
            <PanelContext.Provider
                value={{
                    visibleId,
                    isPanelVisible,
                }}
            >
                <div
                    class=" flex h-screen w-screen justify-center"
                    classList={{
                        'font-global': !defaultFont(),
                    }}
                >
                    <main class=" flex h-full w-full max-w-4xl flex-col overflow-hidden  p-2 text-gray-400 sm:p-4">
                        <h2 class="cursor-pointer text-center text-xl font-bold text-gray-300">
                            AI 绘画三星法器 —— 魔导绪论
                            <sup class="px-2 text-xs text-yellow-300">{__version__}</sup>
                            <div class="flex items-center  justify-center gap-2 text-xs font-thin text-[#f5f3c2]">
                                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                    {t('header.Doc')}
                                </a>
                                ·
                                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                    Github
                                </a>
                                ·
                                <a href="./gallery.html" target="_blank">
                                    {t('header.Gallery')}
                                </a>
                                ·
                                <span onClick={() => visibleId('feedback')}>
                                    {t('header.FeedBack')}
                                </span>
                                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                    {'{{ By 江夏尧 }}'}
                                </a>
                                {!r18Mode() && (
                                    <span
                                        class="btn bg-green-700"
                                        onClick={() => {
                                            Notice.success(t('header.hint.teen'));
                                        }}
                                    >
                                        {t('header.TeenagerMode')}
                                    </span>
                                )}
                            </div>
                        </h2>
                        <UserSelected></UserSelected>
                        <SearchBox></SearchBox>
                    </main>
                    <SideApp></SideApp>
                    <Show when={!defaultFont()}>
                        <FontSupport></FontSupport>
                    </Show>
                </div>
            </PanelContext.Provider>
        </Data.Provider>
    );
};
