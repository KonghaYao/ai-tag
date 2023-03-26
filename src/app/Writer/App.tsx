import { For, Match, Switch } from 'solid-js';
import { TextEditor } from './Editor/TextEditor';
import { TagsEditor } from './Editor/TagsEditor';
import { ArrayAtom, atom } from '@cn-ui/use';
interface Comment {}

export interface Block {
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
import { nanoid } from 'nanoid';
import { WriterContext } from './WriterContext';
export class BlockConvert {
    static extendsBlock(block: Block): Block {
        return {
            ...block,
            comment: [...block.comment],
            history: [block.id, ...block.history],
            content: { ...block.content },
            id: nanoid(),
        };
    }
    static createBlock(): Block {
        return {
            type: 'text',
            comment: [],
            history: [],
            content: { text: '' },
            id: nanoid(),
        };
    }
}

export const useTagsArticle = (json: Article | undefined) => {
    const Article: Article = json ?? { id: nanoid(), content: [] };
    const content = ArrayAtom(atom(Article.content));
    return {
        content,
        move(which: Block, pos: 'up' | 'down') {
            const old = content();
            const index = old.indexOf(which);
            const item = pos === 'up' ? old[index - 1] : old[index + 1];
            item && content.switch(which, item);
            console.log(index);
        },
    };
};
export const Writer = () => {
    const inputs = useTagsArticle({
        id: '1',
        content: [
            { id: '2', type: 'text', history: [], content: { text: '支持中国' }, comment: [] },
            {
                id: '3',
                type: 'tags',
                history: [],
                content: {
                    text: '((best quality)),(((flat color))),thick outlines,((limited palette)),medium shot,album cover,depth of field,((falling petals)),snowy city street,snow ground and tree with light,gorgeous Norwegian girl,cute natural makeup,long wavy blonde hair,freckles,blue eyes',
                },
                comment: [],
            },
        ],
    });
    return (
        <WriterContext.Provider value={inputs}>
            <main class="flex w-full max-w-3xl flex-col  p-4 text-slate-100">
                <header class="pt-8 pb-4 text-xl"> GPT Make Me Great Again</header>
                <article class="flex h-full w-full flex-1 flex-col gap-4 overflow-auto">
                    <For each={inputs.content()}>
                        {(block) => {
                            return (
                                <Switch>
                                    <Match when={block.type === 'text'}>
                                        <TextEditor block={block}></TextEditor>
                                    </Match>
                                    <Match when={block.type === 'tags'}>
                                        <TagsEditor block={block}></TagsEditor>
                                    </Match>
                                </Switch>
                            );
                        }}
                    </For>
                    <aside class="h-full min-h-[20vh]">
                        <div
                            onclick={() => {
                                inputs.content((i) => [...i, BlockConvert.createBlock()]);
                            }}
                        >
                            添加
                        </div>
                    </aside>
                </article>
            </main>
        </WriterContext.Provider>
    );
};
