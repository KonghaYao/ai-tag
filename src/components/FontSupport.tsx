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
                    href="https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/江西拙楷2.0/result.css"
                ></link>
                <link rel="stylesheet" href="https://unpkg.com/@fontsource/aclonica/400.css"></link>
            </Show>
        </>
    );
};
