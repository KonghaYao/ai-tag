import { Accessor, createContext } from 'solid-js';
import type { Atom } from '@cn-ui/use';
import { SearchBox } from '../../components/SearchBox/SearchBox';

import type { initGlobalTags } from '../../store/useGlobalTags';

export interface ITagData extends IPromptData {
    en: string;
    cn: string;
    // 暂时没有打上
    r18: 0 | 1;
    count: number;
}
import type { IStoreData } from '../../store/index';
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
import { Message, MessageHint } from '../../components/MessageHInt';
import { Background } from '../../components/Background';
import { DropReceiver } from '@cn-ui/headless';
import { GlobalHeader } from './GlobalHeader';
import { TranslationPanel } from '../../plugins/globalTranslate/TranslationPanel';
import { UserSelected } from './UserSelected';
import { GlobalData } from '../../store/GlobalData';

export const Main = () => {
    const { backgroundImage } = GlobalData.getApp('data');

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
                        'opacity-90': !!backgroundImage(),
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
                    {/* <SideApp></SideApp> */}
                    <MessageHint></MessageHint>
                </section>
            </DropReceiver>
            <TranslationPanel></TranslationPanel>
        </>
    );
};
