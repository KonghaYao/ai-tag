import { Atom, atomization } from '@cn-ui/use';
import { Component, Show } from 'solid-js';

export const FontSupport: Component<{ show?: boolean | Atom<boolean>; delay?: number }> = (
    props
) => {
    const show = atomization(props.show ?? true);
    if (typeof props.delay === 'number') {
        setTimeout(() => {
            show(true);
        }, props.delay);
    }
    return (
        <>
            <Show when={show()}>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/@chinese-fonts/jxzk@1.1.0/dist/江西拙楷/result.css"
                ></link>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/@fontsource/aclonica@4.5.9/400.css"
                ></link>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/@fontsource/material-icons-rounded@4.5.4/400.css"
                ></link>
            </Show>
        </>
    );
};
