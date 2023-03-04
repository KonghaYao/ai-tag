import { Atom, atomization } from '@cn-ui/use';
import { Component, Show } from 'solid-js';
// import '@chinese-fonts/jxzk/dist/江西拙楷/result.css';
export const FontSupport: Component<{ show?: boolean | Atom<boolean>; delay?: number }> = (
    props
) => {
    const show = atomization(props.show ?? true);

    requestIdleCallback(
        (deadline) => {
            if (deadline.timeRemaining() > 0) {
                show(true);
                console.log('渲染字体');
            }
        },
        {
            timeout: props.delay ?? 1000,
        }
    );

    return (
        <>
            <Show when={show()}>
                <link rel="stylesheet" href="./font/result.css"></link>
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
