import { Atom, atom } from '@cn-ui/use';
import { createContext, Suspense } from 'solid-js';
import { useTranslation } from '../i18n';
import { Message, MessageHint } from '../src/MessageHint';
import { useDragAndDropData } from '../src/use/useDragAndDropData';
import { Notice } from '../src/utils/notice';
import { MagicList } from './MagicList';
import { useIndexedDB } from './use/useIndexedDB';
export const NoteBookContext = createContext<{
    hidImage: Atom<boolean>;
}>();
export const App = () => {
    const { addMagic } = useIndexedDB();
    const { receive, detect } = useDragAndDropData();
    const { t } = useTranslation();
    const hidImage = atom(false);
    return (
        <NoteBookContext.Provider value={{ hidImage }}>
            <main
                class="font-global flex h-screen w-screen flex-col overflow-hidden text-gray-400"
                ondragover={(e) => {
                    e.preventDefault();
                    detect(e.dataTransfer, {
                        PURE_TAGS() {
                            Message.success(t('Notebook.hint.PURE_TAGS'));
                        },
                    });
                }}
                ondrop={(e) => {
                    e.preventDefault();
                    const isReceived = receive(e.dataTransfer, 'PURE_TAGS', (tags) => {
                        addMagic(tags);
                        Notice.success('创建魔咒成功');
                        return true;
                    });
                    if (!isReceived) {
                        // 文本形式的魔咒导入
                        const tags = e.dataTransfer.getData('text');
                        if (tags) {
                            const isReal = confirm(`这是一个魔咒吗？\n ${tags}`);
                            if (isReal) {
                                addMagic(tags);
                                Notice.success('创建魔咒成功');
                            }
                        }
                    }
                }}
            >
                <div class=" mx-4 my-2 flex items-center divide-x-2 divide-gray-700 rounded-md bg-slate-800 p-2">
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
        </NoteBookContext.Provider>
    );
};
