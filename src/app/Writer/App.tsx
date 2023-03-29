import { For, Match, Switch, useContext } from 'solid-js';
import { TextEditor } from './Editor/TextEditor';
import { TagsEditor } from './Editor/TagsEditor';
import { ArrayAtom, atom } from '@cn-ui/use';

import { nanoid } from 'nanoid';
import { WriterContext } from './WriterContext';
import { GlobalHeader } from '../main/GlobalHeader';
import { BaseBlock, Article, createBlockByType } from './interface';
import { useTranslation } from '../../i18n';
import { GlobalData } from '../../store/GlobalData';
import { useWebView } from '../../Panels/Webview';
import { HeaderFirst } from '../main/ToolBar/HeaderFirst';

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
        ].map((i) => createBlockByType(i.type as any).fromJSON(i)),
    });
    return (
        <WriterContext.Provider value={inputs}>
            <main class="flex w-full max-w-3xl flex-col  overflow-auto  px-4 text-slate-100">
                <nav class="sticky top-2 z-50 my-2">
                    <GlobalHeader></GlobalHeader>
                    <HeaderFirst></HeaderFirst>
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
                    <aside class="flex h-full min-h-[20vh] justify-center">
                        <BlockAdd></BlockAdd>
                    </aside>
                </article>
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
        <div class="cursor-pointer">
            <span onclick={addToBlocks}>添加一个</span>
            <select ref={ref} class="bg-slate-800" oninput={addToBlocks}>
                <option value="text">文本</option>
                <option value="tags">魔咒</option>
            </select>
        </div>
    );
};
