import { Component, For, JSXElement, Show, batch, createEffect } from 'solid-js';
import { Atom, addListener, atom, reflect } from '@cn-ui/use';
type TipsInput = { originText: string; value: string; desc?: string };
export const ToolTips: Component<{
    infoList: Atom<TipsInput[]>;
    onConfirm: (output: string) => void;
}> = ({ infoList, onConfirm }) => {
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
                {(item, index) => {
                    let it!: HTMLLIElement;
                    const isSelect = reflect(() => focusing() === index());
                    createEffect(() => {
                        isSelect() && it!.scrollIntoView(false);
                    });
                    return (
                        <li
                            class="pl-2 hover:bg-slate-600"
                            classList={{
                                'bg-slate-700': isSelect(),
                            }}
                            onclick={(e) => {
                                batch(() => {
                                    const originText = item.originText.endsWith(' ')
                                        ? item.originText
                                        : item.originText + ' ';
                                    onConfirm(originText + it.textContent);

                                    infoList([]);
                                });
                            }}
                        >
                            <span class="pr-4" ref={it}>
                                {item.value}
                            </span>
                            <span class="max-w-[50%] text-ellipsis whitespace-nowrap text-xs text-slate-200">
                                {item.desc}
                            </span>

                            <Show when={isSelect()}>
                                <span class="float-right">↩️</span>
                            </Show>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
};
