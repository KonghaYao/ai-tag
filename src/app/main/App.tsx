import { Accessor, createContext, createEffect, createSelector, onMount, Show } from 'solid-js';
import { Atom, atom, isAtom, useBreakpoints } from '@cn-ui/use';
import { SearchBox } from '../../components/SearchBox/SearchBox';
import { UserSelected } from './UserSelected';
import { useGlobalTags } from '../../use/useGlobalTags';
import { useStorage } from '../../use/useStorage';
import { PanelIds, SideApp } from './SideApp';

export interface IData extends IPromptData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
}
import { initGlobalData, IStoreData } from '../../store/index';
export type { IStoreData } from '../../store/index';
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
export const Data = createContext<IGlobalData & ReturnType<typeof useGlobalTags>>();
import isMobile from 'is-mobile';
import type { IPromptData } from 'promptor';
import { PanelContext } from '../../components/Panel';
import { FontSupport } from '../../components/FontSupport';
import { useLocalData } from '../../use/useLocalData';
import { Message, MessageHint } from '../../components/MessageHInt';
import { Background } from '../../components/Background';
import { DropReceiver } from '@cn-ui/headless';
import { GlobalHeader } from './GlobalHeader';
import { TranslationPanel } from '../../plugins/globalTranslate/TranslationPanel';
export const Main = () => {
    const sideAppMode = atom(!isMobile());
    const visibleId = atom<PanelIds | ''>('ai-prompt');
    const isPanelVisible = createSelector(visibleId);

    /** 需要持久化的变量写这里 */
    const storageSetting = initGlobalData();

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
                ...useGlobalTags(storageSetting),
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
                    <section
                        class=" flex h-screen w-screen justify-center"
                        classList={{
                            'font-global': !storageSetting.defaultFont(),
                            'opacity-70': !!backgroundImage(),
                        }}
                    >
                        <Background image={backgroundImage()}></Background>

                        <main
                            id="main-panel"
                            class=" flex h-full w-full max-w-4xl flex-col overflow-visible px-2 pt-2 text-gray-400 sm:px-4 sm:pt-4"
                        >
                            <GlobalHeader></GlobalHeader>
                            <UserSelected></UserSelected>
                            <SearchBox></SearchBox>
                        </main>
                        <SideApp></SideApp>
                        <MessageHint></MessageHint>

                        <FontSupport delay={200} show={atom(false)}></FontSupport>
                    </section>
                </DropReceiver>
                <TranslationPanel></TranslationPanel>
            </PanelContext.Provider>
        </Data.Provider>
    );
};
