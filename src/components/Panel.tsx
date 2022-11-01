import { atom } from '@cn-ui/use';
import { Component, createEffect, createMemo, JSXElement, Show, useContext } from 'solid-js';
import { Data } from '../App';
import { PanelIds } from '../SideApp';
import { ControlBar } from './ControlBar';

export const Panel: Component<{ children?: JSXElement; id: PanelIds | '' }> = (props) => {
    const { visibleId, isPanelVisible } = useContext(Data);
    let container: HTMLDivElement;
    const visible = createMemo(() => isPanelVisible(props.id));
    const hasOpened = createMemo(() => visibleId() !== null);
    const hidden = atom(!visible());
    createEffect(() => {
        if (visible()) hidden(false);
    });
    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center p-6 transition-all duration-500"
            classList={{
                'scale-100': visible(),
                'scale-0': !visible(),
                'translate-y-full': !visible(),
                'pointer-event-none': !visible(),
                hidden: hidden(),
            }}
            onTransitionEnd={() => {
                // console.log(!visible());
                hidden(!visible());
            }}
            onClick={(e) => {
                if (e.target === container) visibleId(null);
                // console.log(e);
            }}
        >
            <main class="flex h-full w-full max-w-sm flex-col overflow-auto overflow-hidden rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 backdrop-blur transition-all sm:max-w-md">
                {props.children}
                <Show when={hasOpened()}>
                    <ControlBar></ControlBar>
                </Show>
            </main>
        </nav>
    );
};
