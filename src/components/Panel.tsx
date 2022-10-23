import { Atom } from '@cn-ui/use';
import { Component, JSXElement } from 'solid-js';

export const Panel: Component<{ children?: JSXElement; visible: Atom<boolean> }> = (props) => {
    let container: HTMLDivElement;

    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 flex h-screen w-screen items-center justify-center p-12 transition-all duration-300"
            classList={{
                'scale-100': props.visible(),
                'scale-0': !props.visible(),
                'pointer-event-none': !props.visible(),
            }}
            onClick={(e) => {
                if (e.target === container) props.visible(false);
                // console.log(e);
            }}
        >
            {/*  本来不应该有背景色的，但是部署出现了问题 */}
            <main class="flex h-full w-full max-w-sm flex-col overflow-auto rounded-2xl border border-solid border-slate-700 bg-gray-700/60 shadow-xl backdrop-blur transition-all">
                {props.children}
            </main>
        </nav>
    );
};
