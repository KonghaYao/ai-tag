import { Accessor, createContext, createEffect, createSelector, Show } from 'solid-js';
import { Atom, atom, useBreakpoints } from '@cn-ui/use';
import { SearchBox } from './SearchBox/SearchBox';
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
    iconBtn: Atom<boolean>;
    nonBreakLine: Atom<boolean>;
    forceEN: Atom<boolean>;
    showClassify: Atom<boolean>;
    tag_version: Atom<string>;
}
export interface IGlobalData extends IStoreData {
    emphasizeAddMode: Atom<boolean>;
    emphasizeSubMode: Atom<boolean>;
    sideAppMode: Atom<boolean>;
    searchText: Atom<string>;
    usersCollection: Atom<IData[]>;
    result: Atom<IData[]>;
    lists: Accessor<IData[]>;
    backgroundImage: Atom<string>;
}
export const Data = createContext<IGlobalData & ReturnType<typeof useDatabase>>();
import isMobile from 'is-mobile';
import { IPromptData } from 'promptor';
import { PanelContext } from './components/Panel';
import { FontSupport } from './components/FontSupport';
import { useLocalData } from './use/useLocalData';
import { Message, MessageHint } from './MessageHint';
import { Background } from './components/Background';
import { DropReceiver } from '@cn-ui/headless';
import { GlobalHeader } from './GlobalHeader';
export const App = () => {
    const enMode = atom(true);
    const r18Mode = atom(false);
    const sideAppMode = atom(!isMobile());
    const showCount = atom(true);
    const deleteMode = atom(false);
    const defaultFont = atom(false);
    const iconBtn = atom(false);
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
    const nonBreakLine = atom<boolean>(false);
    const forceEN = atom<boolean>(false);
    const showClassify = atom<boolean>(true);
    const tag_version = atom('2.1.1');

    /** 需要持久化的变量写这里 */
    const storageSetting = {
        tag_version,
        showClassify,
        nonBreakLine,
        forceEN,
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
        iconBtn,
    };

    const { recover, tracking } = useStorage(storageSetting);
    const { backgroundImage } = useLocalData();
    const { isSize } = useBreakpoints();
    // 自动变换 SideAPP 状态
    createEffect(() => sideAppMode(!(isSize('xs') || isSize('sm'))));
    recover();
    tracking();
    return (
        <Data.Provider
            value={{
                sideAppMode,
                ...useDatabase(storageSetting),
                backgroundImage,
                ...storageSetting,
            }}
        >
            <PanelContext.Provider
                value={{
                    visibleId,
                    isPanelVisible,
                }}
            >
                <DropReceiver
                    detect={{
                        PURE_TAGS() {
                            Message.success('你可以拖拽魔咒文本到任何编辑器！');
                        },
                    }}
                >
                    <div
                        class=" flex h-screen w-screen justify-center"
                        classList={{
                            'font-global': !defaultFont(),
                            'opacity-70': !!backgroundImage(),
                        }}
                    >
                        <Background image={backgroundImage()}></Background>

                        <main class=" flex h-full w-full max-w-4xl flex-col overflow-hidden px-2 pt-2 text-gray-400 sm:px-4 sm:pt-4">
                            <GlobalHeader></GlobalHeader>
                            <UserSelected></UserSelected>
                            <SearchBox></SearchBox>
                        </main>
                        <SideApp></SideApp>
                        <MessageHint></MessageHint>
                        <Show when={!defaultFont()}>
                            <FontSupport delay={200} show={atom(false)}></FontSupport>
                        </Show>
                    </div>
                </DropReceiver>
            </PanelContext.Provider>
        </Data.Provider>
    );
};
