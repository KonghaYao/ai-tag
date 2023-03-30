import { Component, For, JSXElement, Show, useContext } from 'solid-js';
import { atom } from '@cn-ui/use';
import type { BaseBlock } from '../../interface';
import { WriterContext } from '../../WriterContext';
import { FloatPanel } from '@cn-ui/core';

export const Convertor: Component<{ block: BaseBlock }> = (props) => {
    const { transform } = useContext(WriterContext)!;
    return (
        <>
            <label class="py-1 text-xs"> 转换为</label>
            <For each={props.block.canTransTo}>
                {(item) => {
                    return (
                        <li
                            class="cursor-pointer hover:bg-slate-600"
                            onclick={() => {
                                transform(props.block, props.block.transTo(item));
                            }}
                        >
                            {item.label}
                        </li>
                    );
                }}
            </For>
        </>
    );
};

export const Transformers = (props: { children?: JSXElement; block: BaseBlock }) => {
    const Floating = () => {
        const { move, content } = useContext(WriterContext)!;
        const isConfirmDelete = atom(false);
        return (
            <ul class="w-full cursor-pointer whitespace-nowrap  rounded-lg bg-slate-800 p-2">
                <li class="hover:bg-slate-600" onclick={() => move(props.block, 'up')}>
                    🔼上移
                </li>
                <li
                    class="hover:bg-slate-600"
                    onclick={() =>
                        isConfirmDelete() ? content.remove(props.block) : isConfirmDelete(true)
                    }
                >
                    {isConfirmDelete() ? '⁉️你确定？' : '🚫删除这块'}
                </li>
                <li class="hover:bg-slate-600" onclick={() => move(props.block, 'down')}>
                    🔽下移
                </li>
                <hr></hr>

                <Convertor block={props.block}></Convertor>
            </ul>
        );
    };
    return (
        <FloatPanel
            position="rt"
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <Floating></Floating>
                        {props.children}
                    </Show>
                );
            }}
        >
            <nav class="cursor-pointer">🧬</nav>
        </FloatPanel>
    );
};
