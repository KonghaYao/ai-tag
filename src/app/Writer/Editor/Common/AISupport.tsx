import { For, Show } from 'solid-js';
import type { Atom } from '@cn-ui/use';
import type { BaseBlock } from '../../interface';
import { FloatPanel } from '@cn-ui/core';
import { CNModelName } from '../../../../api/prompt-gpt/CNModelName';
import type { GlobalGPT } from '../../../../api/prompt-gpt';

export const AISupport = (props: { model: Atom<keyof typeof GlobalGPT>; block: BaseBlock }) => {
    return (
        <FloatPanel
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <ul class="w-full whitespace-nowrap rounded-lg  bg-slate-800 p-2">
                            <li>🎆AI 辅助</li>

                            <For
                                each={props.block.supportAI.map((i) => {
                                    return [i, CNModelName[i]];
                                })}
                            >
                                {([key, value]) => {
                                    return (
                                        <li
                                            class="w-full p-1 hover:bg-slate-700"
                                            onClick={() => props.model(key as any)}
                                        >
                                            {value}
                                        </li>
                                    );
                                }}
                            </For>
                        </ul>
                    </Show>
                );
            }}
        >
            <nav class="cursor-pointer">✨</nav>
        </FloatPanel>
    );
};
