import { For } from 'solid-js';
import { ContentEditable } from '../../components/ContentEditable';
import { GlobalData } from '../../store/GlobalData';
import { atom } from '@cn-ui/use';
interface Comment {}

interface Block {
    id: string;
    type: string;
    history: string[]; // 根据 id 获取到历史 Block
    content: {
        text: string;
    };
    comment: Comment[];
}

interface Article {
    id: string;
    content: Block[];
}

export const Writer = () => {
    const inputs: Article = {
        id: '1',
        content: [
            { id: '2', type: 'text', history: [], content: { text: '支持' }, comment: [] },
            {
                id: '3',
                type: 'text',
                history: [],
                content: { text: 'masterpiece,username,' },
                comment: [],
            },
        ],
    };
    return (
        <main class="flex w-full max-w-xl flex-col bg-slate-700 p-4 text-slate-100">
            <header class="pt-8 pb-4 text-xl"> AI 自动机器</header>
            <article class="flex h-full w-full flex-1 flex-col overflow-auto ">
                <For each={inputs.content}>
                    {(block) => {
                        if (block.type === 'text') {
                            const text = atom(block.content.text);

                            return <ContentEditable value={text}></ContentEditable>;
                        }
                    }}
                </For>
            </article>
        </main>
    );
};
