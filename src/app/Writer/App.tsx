import { For, Match, Switch, useContext } from 'solid-js';
import { TextEditor } from './Editor/TextEditor';
import { TagsEditor } from './Editor/TagsEditor';
import { ArrayAtom, atom } from '@cn-ui/use';
import { nanoid } from 'nanoid';
import { WriterContext } from './WriterContext';
import { GlobalHeader } from '../main/GlobalHeader';
import { BaseBlock, Article, createBlockByType, TextBlock, TagsBlock } from './interface';
import { Message, MessageHint } from '../../components/MessageHInt';
import copy from 'copy-to-clipboard';
import { Notice } from '../../utils/notice';
import { Header } from './Header';
import { triggerNews } from '../../utils/newsReport';

export const useTagsArticle = (json: Article | undefined) => {
    const Article: Article = json ?? { id: nanoid(), content: [] };
    const content = ArrayAtom(atom(Article.content));
    return {
        content,
        move(which: BaseBlock, pos: 'up' | 'down') {
            const old = content();
            const index = old.indexOf(which);
            const item = pos === 'up' ? old[index - 1] : old[index + 1];
            item && content.switch(which, item);
            console.log(index);
        },
        transform(which: BaseBlock, to: BaseBlock) {
            content.replace(which, to);
        },
    };
};

export const Writer = () => {
    triggerNews();
    const inputs = useTagsArticle({
        id: '1',
        content: [
            new TagsBlock(
                '((best quality)),(((flat color))),thick outlines,((limited palette)),medium shot,album cover,depth of field,((falling petals)),snowy city street,snow ground and tree with light,gorgeous Norwegian girl,cute natural makeup,long wavy blonde hair,freckles,blue eyes'
            ),
            new TextBlock(),
        ],
    });
    return (
        <WriterContext.Provider value={inputs}>
            <main class="flex w-full max-w-3xl flex-col  overflow-auto  px-4 text-slate-100">
                <nav class="sticky top-2 z-50 my-2">
                    <GlobalHeader></GlobalHeader>
                    <Header></Header>
                </nav>
                <article class="flex h-full w-full flex-1 flex-col gap-4 ">
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
                    <aside class="flex h-full min-h-[20vh] justify-center gap-4 pt-4">
                        <BlockAdd></BlockAdd>
                        <div
                            class="flex h-fit cursor-pointer items-center rounded-lg bg-sky-700 p-2 outline-none"
                            onclick={() => {
                                copy(
                                    inputs
                                        .content()
                                        .map((i) => i.content.text)
                                        .join('\n')
                                );
                                Notice.success('复制成功');
                            }}
                        >
                            🐰复制全局
                        </div>
                    </aside>
                </article>
                <MessageHint></MessageHint>
            </main>
        </WriterContext.Provider>
    );
};

export const BlockAdd = () => {
    const inputs = useContext(WriterContext)!;
    let ref!: HTMLSelectElement;
    const addToBlocks = () => {
        inputs.content((i) => [...i, createBlockByType(ref.value as any)]);
    };
    return (
        <div class="flex h-fit cursor-pointer items-center rounded-lg bg-purple-800  p-2 ">
            <span onclick={addToBlocks}>😽添加一个</span>
            {/* 不能使用 transparent, 因为option还是白色底 */}
            <select
                ref={ref}
                class="bg-purple-800 px-2 text-xl outline-none "
                oninput={addToBlocks}
            >
                <option value="text">文本</option>
                <option value="tags">魔咒</option>
            </select>
        </div>
    );
};
