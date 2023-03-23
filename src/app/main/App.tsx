import { Accessor, createContext, createEffect } from 'solid-js';
import { Atom, atom, useBreakpoints } from '@cn-ui/use';
import { SearchBox } from '../../components/SearchBox/SearchBox';

import { initGlobalTags } from '../../store/useGlobalTags';

import { SideApp } from '../SideApp';

export interface ITagData extends IPromptData {
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
    usersCollection: Atom<ITagData[]>;
    result: Atom<ITagData[]>;
    lists: Accessor<ITagData[]>;
    backgroundImage: Atom<string>;
}
export const Data = createContext<IGlobalData & ReturnType<typeof initGlobalTags>>();
import type { IPromptData } from 'promptor';
import { PanelContext } from '../../components/Panel';
import { FontSupport } from '../../components/FontSupport';
import { useLocalData } from '../../use/useLocalData';
import { Message, MessageHint } from '../../components/MessageHInt';
import { Background } from '../../components/Background';
import { DropReceiver } from '@cn-ui/headless';
import { GlobalHeader } from './GlobalHeader';
import { TranslationPanel } from '../../plugins/globalTranslate/TranslationPanel';
import { initSideApp } from '../../store/SideAppStore';
import { UserSelected } from './UserSelected';

export const Main = () => {
    const sideAPP = initSideApp();
    const { sideAppMode } = sideAPP;
    /** 需要持久化的变量写这里 */
    const storageSetting = initGlobalData();
    initGlobalTags(storageSetting);
    const { isSize } = useBreakpoints();
    // 自动变换 SideAPP 状态
    createEffect(() => sideAppMode(!(isSize('xs') || isSize('sm'))));

    return (
        <>
            <DropReceiver
                detect={{
                    PURE_TAGS() {
                        Message.success('你可以拖拽魔咒文本到任何编辑器！');
                    },
                }}
            >
                <section
                    class="  flex justify-center"
                    classList={{
                        'opacity-70': !!storageSetting.backgroundImage(),
                    }}
                >
                    <Background image={storageSetting.backgroundImage()}></Background>

                    <main
                        id="main-panel"
                        class=" flex h-full w-full max-w-4xl flex-col overflow-visible px-2 pt-2 text-gray-400 sm:px-4 sm:pt-4"
                    >
                        <GlobalHeader></GlobalHeader>
                        <UserSelected></UserSelected>
                        <SearchBox></SearchBox>
                    </main>
                    {/* <SideApp></SideApp> */}
                    <MessageHint></MessageHint>

                    <FontSupport delay={200} show={atom(false)}></FontSupport>
                </section>
            </DropReceiver>
            <TranslationPanel></TranslationPanel>
        </>
    );
};
