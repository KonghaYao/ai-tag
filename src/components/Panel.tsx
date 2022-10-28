import { Atom } from '@cn-ui/use';
import { Component, createMemo, JSXElement, useContext } from 'solid-js';
import { Data } from '../App';
import { PanelIds } from '../SideApp';

export const Panel: Component<{ children?: JSXElement; id: PanelIds | '' }> = (props) => {
    const { visibleId, isPanelVisible } = useContext(Data);
    let container: HTMLDivElement;
    const visible = createMemo(() => isPanelVisible(props.id));
    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 flex h-full w-full items-center justify-center p-6 transition-all duration-300 "
            classList={{
                'scale-100': visible(),
                'scale-0': !visible(),
                'pointer-event-none': !visible(),
            }}
            onClick={(e) => {
                if (e.target === container) visibleId(null);
                // console.log(e);
            }}
        >
            <main class="flex h-full w-full max-w-sm flex-col overflow-auto rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 backdrop-blur  transition-all sm:max-w-md">
                {props.children}
            </main>
        </nav>
    );
};
