import { atom } from '@cn-ui/use';
import { Component, JSXElement, useContext, createMemo, createEffect } from 'solid-js';
import { PanelContext } from '../../src/components/Panel';
import { PanelIds } from '../../src/app/SideApp';

export const GalleryPanel: Component<{ children?: JSXElement; id: PanelIds | '' }> = (props) => {
    const { visibleId, isPanelVisible } = GlobalData.getApp('side-app');
    let container: HTMLDivElement;
    const visible = createMemo(() => isPanelVisible(props.id));
    const hidden = atom(!visible());
    createEffect(() => {
        if (visible()) hidden(false);
    });
    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 z-20 flex h-full w-full flex-col items-center justify-center p-2 transition-all duration-500 sm:p-6"
            classList={{
                'scale-100': visible(),
                'scale-0': !visible(),
                'translate-y-full': !visible(),
                'pointer-event-none': !visible(),
                hidden: hidden(),
            }}
            onTransitionEnd={() => {
                hidden(!visible());
            }}
            onClick={(e) => {
                if (e.target === container) visibleId(null);
                // console.log(e);
            }}
        >
            {/* blur-background 因为 tailwind 的方式有 BUG */}
            <main class="blur-background relative flex h-full w-full max-w-sm  flex-col overflow-auto rounded-2xl border-2 border-solid border-slate-500  transition-all sm:max-w-2xl">
                {props.children}
            </main>
        </nav>
    );
};
