import { Atom, atom } from '@cn-ui/use';
import { pick } from 'lodash-es';
import {
    Component,
    createContext,
    createEffect,
    createMemo,
    JSX,
    JSXElement,
    Show,
    useContext,
} from 'solid-js';
import { PanelIds } from '../SideApp';
import { ControlBar } from './ControlBar';

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
            ondragover={props.ondragover}
            ondrop={props.ondrop}
            onClick={(e) => {
                if (e.target === container) visibleId(null);
                // console.log(e);
            }}
        >
            {/* blur-background 因为 tailwind 的方式有 BUG */}
            <main class="blur-background flex h-full w-full max-w-sm flex-col  overflow-auto rounded-2xl border-2 border-solid border-slate-700 bg-gray-700/60 transition-all sm:max-w-md">
                {props.children}
                <Show when={hasOpened()}>
                    <ControlBar></ControlBar>
                </Show>
            </main>
        </nav>
    );
};
