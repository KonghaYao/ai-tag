import { Suspense } from 'solid-js';
import { useTranslation } from '../i18n';
import { Message, MessageHint } from '../src/MessageHint';
import { useDragAndDropData } from '../src/use/useDragAndDropData';
import { Notice } from '../src/utils/notice';
import { MagicList } from './MagicList';
import { useIndexedDB } from './use/useIndexedDB';

export const App = () => {
    const { addMagic } = useIndexedDB();
    const { receive, detect } = useDragAndDropData();
    const { t } = useTranslation();
    return (
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
                receive(e.dataTransfer, 'PURE_TAGS', (tags) => {
                    addMagic(tags);
                    Notice.success('创建魔咒成功');
                });
                const tags = e.dataTransfer.getData('text');
                if (tags) {
                    const isReal = confirm(`这是一个魔咒吗？\n ${tags}`);
                    if (isReal) {
                        addMagic(tags);
                        Notice.success('创建魔咒成功');
                    }
                }
            }}
        >
            <header class=" w-full p-4 text-center text-xl">魔咒记忆器</header>
            <div class="text-center text-sm text-amber-500">
                你可以拖拽任意的字符串到这个网站作为 TAG！
            </div>
            <div class="text-center text-sm text-amber-500">测试版本中！</div>
            <main class="mx-auto mt-4 flex w-full flex-col overflow-auto">
                <MagicList></MagicList>
            </main>
            <MessageHint></MessageHint>
        </main>
    );
};
