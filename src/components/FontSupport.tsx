import { Atom, atomization } from '@cn-ui/use';
import { Component, Show, onMount } from 'solid-js';
// import '@chinese-fonts/jxzk/dist/江西拙楷/result.css';
export const FontSupport: Component<{ show?: boolean | Atom<boolean>; delay?: number }> = (
    props
) => {
    const show = atomization(props.show ?? true);

    onMount(() => {
        setTimeout(
            (deadline) => {
                show(true);
                console.log('渲染字体');
            },

            props.delay ?? 1000
        );
    });

    return (
        <>
            <Show when={show()}>
                <link
                    rel="stylesheet"
                    href="https://ik.imagekit.io/chinesefonts/packages/jxzk/dist/%E6%B1%9F%E8%A5%BF%E6%8B%99%E6%A5%B7/result.css"
                ></link>
            </Show>
            <link
                rel="stylesheet"
                href="https://unpkg.com/@fontsource/aclonica@4.5.9/400.css"
            ></link>
            <link
                rel="stylesheet"
                href="https://unpkg.com/@fontsource/material-icons-rounded@4.5.4/400.css"
            ></link>
        </>
    );
};
