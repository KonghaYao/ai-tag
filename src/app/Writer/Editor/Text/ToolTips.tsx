import { Component, For, Show } from 'solid-js';
import { Atom, ResourceAtom, addListener, atom } from '@cn-ui/use';

export const ToolTips: Component<{
    infoList: ResourceAtom<string[][]>;
    text: Atom<string>;
}> = ({ infoList, text }) => {
    const focusing = atom(0);
    let container!: HTMLUListElement;
    addListener(window, 'keydown', (e: any) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusing((i) => (i < infoList().length - 1 ? i + 1 : i));
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusing((i) => (i > 0 ? i - 1 : i));
                break;
            case 'Enter':
                e.preventDefault();
                (container?.children[focusing()] as HTMLElement)?.click();
                break;
        }
    });

    return (
        <ul ref={container} class="mt-2 w-full max-w-sm rounded-md bg-slate-800 p-2 text-slate-300">
            <For each={infoList()}>
                {([item, originText], index) => {
                    let it!: HTMLLIElement;
                    return (
                        <li
                            class="pl-2 hover:bg-slate-600"
                            classList={{
                                'bg-slate-700': focusing() === index(),
                            }}
                            onclick={(e) => {
                                infoList([]);
                                text(originText + it.textContent + ' ');
                            }}
                        >
                            <span innerHTML={item} ref={it}></span>
                            <Show when={focusing() === index()}>
                                <span class="float-right">✅</span>
                            </Show>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
};
