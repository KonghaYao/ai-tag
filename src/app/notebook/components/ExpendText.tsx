import { atom } from '@cn-ui/use';
import type { Component, JSXElement } from 'solid-js';

export const ExpendText: Component<
    {
        children: JSXElement;
        open?: JSXElement;
    } & any
> = (props) => {
    const longText = atom(false);
    return (
        <div
            class="cursor-pointer tracking-wider"
            classList={{
                'line-clamp-1': !longText(),
            }}
            onClick={() => longText((i) => !i)}
            {...props}
        >
            {props.children}
            {longText() && props.open}
        </div>
    );
};
