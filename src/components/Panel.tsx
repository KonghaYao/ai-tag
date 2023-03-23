import type { Atom } from '@cn-ui/use';
import { Component, createContext, createMemo, JSX, JSXElement, useContext } from 'solid-js';
import type { PanelIds } from '../app/SideApp';
import { Tab } from '@cn-ui/core';
import { GlobalData } from '../store/GlobalData';

export interface IPanelData {
    visibleId: Atom<PanelIds | ''>;
    isPanelVisible: (key: PanelIds | '') => boolean;
}

export const PanelContext = createContext<IPanelData>();

interface PanelEl extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSXElement;
    id: PanelIds | '';
    class?: string;
}
export const Panel: Component<PanelEl> = (props) => {
    const { visibleId, isPanelVisible } = GlobalData.getApp('side-app')!;
    let container!: HTMLDivElement;
    const visible = createMemo(() => isPanelVisible(props.id));

    return (
        <Tab
            id={props.id}
            destroyOnHide
            class="blur-background absolute top-0 left-0 z-40 flex h-screen w-full flex-col items-center  justify-center"
        >
            <div
                class="btn absolute right-4 top-4 z-40 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg font-sans text-2xl"
                onclick={() => {
                    visibleId('');
                }}
            >
                ×
            </div>
            <nav
                ref={container}
                class={'m-auto flex h-full place-content-center p-6 ' + (props.class ?? '')}
                classList={{
                    'pointer-event-none': !visible(),
                }}
                onDragOver={props.ondragover}
                onDrop={props.ondrop}
                onClick={(e) => {
                    if (e.target === container) visibleId('');
                }}
            >
                <main class=" flex h-full w-full flex-col  overflow-auto rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 transition-all ">
                    {props.children}
                </main>
            </nav>
        </Tab>
    );
};
