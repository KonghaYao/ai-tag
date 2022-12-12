import { Atom, atom } from '@cn-ui/use';
import { createContext, Suspense } from 'solid-js';
import { useTranslation } from '../i18n';
import { DropReceiver } from '@cn-ui/headless';
import { Message, MessageHint } from '../src/MessageHint';
import { Notice } from '../src/utils/notice';
import { MagicList } from './MagicList';
import { useIndexedDB } from './use/useIndexedDB';
export const NoteBookContext = createContext<{
    hidImage: Atom<boolean>;
}>();
export const App = () => {
    const { addMagic } = useIndexedDB();
    const { t } = useTranslation();
    const hidImage = atom(false);
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
                <main class="font-global  m-auto flex h-screen w-screen max-w-6xl flex-col overflow-hidden text-gray-400">
                    <div class=" m-4  flex items-center divide-x-2 divide-gray-700 rounded-md bg-slate-800 p-2">
                        <header class=" pl-2 pr-4 text-xl">魔咒记忆器</header>
                        <div class="flex flex-1 justify-end">
                            <div
                                class="font-icon h-8 w-8 cursor-pointer rounded-md p-1 text-center transition-colors hover:bg-slate-700"
                                onclick={() => hidImage((i) => !i)}
                            >
                                {hidImage() ? 'hide_image' : 'photo'}
                            </div>
                        </div>
                    </div>
                    <div class="text-center text-sm text-amber-500">
                        你可以拖拽任意的字符串到这个网站作为 TAG！
                    </div>
                    <div class="text-center text-sm text-amber-500">测试版本中！</div>
                    <main class="mx-auto mt-4 flex w-full flex-col overflow-auto">
                        <MagicList></MagicList>
                    </main>
                    <MessageHint></MessageHint>
                </main>
            </DropReceiver>
        </NoteBookContext.Provider>
    );
};
