import type { Component, JSXElement } from 'solid-js';
import { Atom, classNames } from '@cn-ui/use';

export const CheckBox: Component<{
    value: Atom<boolean>;
    children: JSXElement;
    class?: string;
}> = (props) => {
    return (
        <span
            class={classNames('btn flex flex-none items-center justify-between ', props.class)}
            onclick={() => props.value((i) => !i)}
        >
            <input type="checkbox" class="h-full" checked={props.value()}></input>
            {props.children}
        </span>
    );
};
