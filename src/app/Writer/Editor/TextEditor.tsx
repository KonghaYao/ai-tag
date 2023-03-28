import { Component, Show, createEffect } from 'solid-js';
import { atom, reflect, useEffectWithoutFirst } from '@cn-ui/use';
import type { BaseBlock } from '../interface';
import { FullTextEditor } from './Text/FullTextEditor';
import { AIPlace } from './Common/AIPlace';
import type { GlobalGPT } from '../../../api/prompt-gpt';
import copy from 'copy-to-clipboard';
import { Notice } from '../../../utils/notice';
import { Transformers } from './Common/Transformers';
import { AISupport } from './Common/AISupport';
export const TextEditor: Component<{ block: BaseBlock }> = (props) => {
    const text = atom(props.block.content.text);
    const showAIPanel = atom(false);
    const model = atom<keyof typeof GlobalGPT>('textToText', { equals: false });
    useEffectWithoutFirst(() => showAIPanel(true), [model]);
    return (
        <aside class="flex flex-col rounded-xl border border-slate-600  px-2 ">
            <div class="flex items-center gap-2">
                <ul class=" grid grid-cols-2">
                    <li
                        class="cursor-pointer"
                        onclick={() => {
                            copy(text());
                            Notice.success('复制成功');
                        }}
                    >
                        📋
                    </li>
                    <AISupport model={model} block={props.block}></AISupport>
                    <Transformers block={props.block}></Transformers>
                </ul>

                <FullTextEditor
                    placeholder="这里可以输入文本进行描述，通过 ✨ 按钮使用 AI"
                    text={text}
                ></FullTextEditor>
            </div>
            <Show when={showAIPanel()}>
                <AIPlace
                    method={model}
                    input={text}
                    onClose={() => showAIPanel(false)}
                    onConfirm={(ai) => text(ai)}
                ></AIPlace>
            </Show>
        </aside>
    );
};
