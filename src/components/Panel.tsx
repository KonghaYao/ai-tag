import { Atom } from '@cn-ui/use';
import { Component, JSXElement } from 'solid-js';

export const Panel: Component<{ children?: JSXElement; visible: Atom<boolean> }> = (props) => {
    let container: HTMLDivElement;

    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 flex h-screen w-screen items-center justify-center p-6 transition-all duration-300 sm:p-12 "
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
            <main class="flex h-full w-full max-w-sm flex-col overflow-auto rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 backdrop-blur  transition-all sm:max-w-md">
                {props.children}
            </main>
        </nav>
    );
};
