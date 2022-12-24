import { Atom, atom } from '@cn-ui/use';
import { Component, createContext, createMemo, JSX, JSXElement, useContext } from 'solid-js';
import { PanelIds } from '../SideApp';
import { ControlBar } from './ControlBar';
import { Tab } from '@cn-ui/core';
import { Animate } from '@cn-ui/animate';

export interface IPanelData {
    visibleId: Atom<string>;
    isPanelVisible: (key: PanelIds | '') => boolean;
}

export const PanelContext = createContext<IPanelData>();

interface PanelEl extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSXElement;
    id: PanelIds | '';
}
export const Panel: Component<PanelEl> = (props) => {
    const { visibleId, isPanelVisible } = useContext(PanelContext);
    let container: HTMLDivElement;
    const visible = createMemo(() => isPanelVisible(props.id));

    return (
        <Tab
            id={props.id}
            destroyOnHide
            class="blur-background absolute top-0 left-0 flex h-screen  w-full flex-col items-center  justify-center"
        >
            <nav
                ref={container}
                class="flex h-full place-content-center p-6"
                classList={{
                    'pointer-event-none': !visible(),
                }}
                ondragover={props.ondragover}
                ondrop={props.ondrop}
                onClick={(e) => {
                    if (e.target === container) visibleId(null);
                }}
            >
                <main class=" flex h-full w-full max-w-sm flex-col  overflow-auto rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 transition-all sm:max-w-md">
                    {props.children}

                    <ControlBar></ControlBar>
                </main>
            </nav>
        </Tab>
    );
};
