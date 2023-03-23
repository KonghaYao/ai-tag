import { Atom, atom } from '@cn-ui/use';
import { createContext, createSelector } from 'solid-js';
import { useTranslation } from '../src/i18n';
import { DropReceiver } from '@cn-ui/headless';
import { Message, MessageHint } from '../src/components/MessageHInt';
import { Notice } from '../src/utils/notice';
import { MagicList } from './MagicList';
import { useIndexedDB } from './use/useIndexedDB';
import { BackupPanel } from './BackupPanel';
import { Tabs } from '@cn-ui/core';
import { Animate } from '@cn-ui/animate';
import { PanelContext } from '../src/components/Panel';
export const NoteBookContext = createContext<{
    hidImage: Atom<boolean>;
}>();
export const App = () => {
    const { addMagic, IndexList } = useIndexedDB();
    const { t } = useTranslation();
    const hidImage = atom(false);
    const visibleId = atom('');
    return (
        <NoteBookContext.Provider value={{ hidImage }}>
            <DropReceiver
                detect={{
                    PURE_TAGS() {
                        Message.success(t('Notebook.hint.PURE_TAGS'));
                    },
                    extra(dataTransfer: DataTransfer) {
                        if ([...dataTransfer.types.values()].some((i) => i.startsWith('text')))
                            Message.success(t('Notebook.hint.text'));
                    },
                }}
                multi={false}
                receive={{
                    PURE_TAGS(tags) {
                        addMagic(tags);
                        Notice.success('创建魔咒成功');
                        return true;
                    },
                    extra(_, dataTransfer: DataTransfer) {
                        const tags = dataTransfer.getData('text');
                        if (tags) {
                            const isReal = confirm(`这是一个魔咒吗？\n ${tags}`);
                            if (isReal) {
                                addMagic(tags);
                                Notice.success('创建魔咒成功');
                            }
                        }
                    },
                }}
            >
                <main class="font-global m-auto flex h-screen w-full max-w-6xl flex-col items-center overflow-y-hidden overflow-x-visible   text-gray-400">
                    <header class="absolute z-10  w-full max-w-6xl ">
                        <main class=" my-4  mx-2 flex items-center divide-x-2 divide-gray-700 rounded-md bg-slate-800 p-2 shadow-lg shadow-gray-900">
                            <header class=" pl-2 pr-4 text-xl">魔咒记忆器</header>
                            <div class="flex flex-1 items-center justify-end ">
                                <div
                                    class="font-icon h-8 w-8 cursor-pointer rounded-md p-1 text-center transition-colors hover:bg-slate-700"
                                    onclick={() => {
                                        const cb = prompt('请输入需要添加的魔咒');
                                        if (cb) {
                                            addMagic(cb);
                                            Notice.success('创建魔咒成功');
                                        }
                                    }}
                                >
                                    add
                                </div>
                                <div
                                    class="font-icon h-8 w-8 cursor-pointer rounded-md p-1 text-center transition-colors hover:bg-slate-700"
                                    onclick={() => visibleId('backup')}
                                >
                                    sync
                                </div>
                                <div
                                    class="font-icon h-8 w-8 cursor-pointer rounded-md p-1 text-center transition-colors hover:bg-slate-700"
                                    onclick={() => hidImage((i) => !i)}
                                >
                                    {hidImage() ? 'hide_image' : 'photo'}
                                </div>
                                <div
                                    class="h-fit rounded-md p-1 text-xs hover:bg-slate-700"
                                    title={`你有 ${IndexList().length} 份魔咒`}
                                >
                                    📝 {IndexList().length}
                                </div>
                            </div>
                        </main>
                    </header>

                    <main class="flex w-full flex-col overflow-y-auto overflow-x-visible px-2">
                        <MagicList></MagicList>
                    </main>
                    <PanelContext.Provider
                        value={{
                            visibleId,
                            isPanelVisible: createSelector(visibleId),
                        }}
                    >
                        <Tabs activeId={visibleId} lazyload>
                            <Animate group anime="jumpFromBottom" appear>
                                <BackupPanel></BackupPanel>
                                <div></div>
                            </Animate>
                        </Tabs>
                    </PanelContext.Provider>

                    <MessageHint></MessageHint>
                </main>
            </DropReceiver>
        </NoteBookContext.Provider>
    );
};
