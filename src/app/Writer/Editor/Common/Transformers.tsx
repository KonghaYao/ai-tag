import { JSXElement, Show, useContext } from 'solid-js';
import { atom } from '@cn-ui/use';
import type { BaseBlock } from '../../interface';
import { WriterContext } from '../../WriterContext';
import { FloatPanel } from '@cn-ui/core';

export const Transformers = (props: { children?: JSXElement; block: BaseBlock }) => {
    const Floating = () => {
        const { move, content } = useContext(WriterContext)!;
        const isConfirmDelete = atom(false);
        return (
            <ul class="w-full whitespace-nowrap rounded-lg  bg-slate-800 p-2">
                <li class="hover:bg-slate-600" onclick={() => move(props.block, 'up')}>
                    上移
                </li>
                <li
                    class="hover:bg-slate-600"
                    onclick={() =>
                        isConfirmDelete() ? content.remove(props.block) : isConfirmDelete(true)
                    }
                >
                    {isConfirmDelete() ? '你确定？' : '删除这块'}
                </li>
                <li class="hover:bg-slate-600" onclick={() => move(props.block, 'down')}>
                    下移
                </li>
            </ul>
        );
    };
    return (
        <FloatPanel
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
