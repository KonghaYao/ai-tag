import { FloatPanel, FloatPanelWithAnimate } from '@cn-ui/core';
import { Atom, DebounceAtom, atom, reflect, resource, useEffectWithoutFirst } from '@cn-ui/use';
import { For, Show, createEffect } from 'solid-js';

function replaceCaret(el: HTMLElement) {
    // Place the caret at the end of the element
    const target = document.createTextNode('');
    el.appendChild(target);
    // do not move caret if element was not focused
    const isTargetFocused = document.activeElement === el;
    if (target !== null && target.nodeValue !== null && isTargetFocused) {
        var sel = window.getSelection();
        if (sel !== null) {
            var range = document.createRange();
            range.setStart(target, target.nodeValue.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        if (el instanceof HTMLElement) el.focus();
    }
}

const splitTextToAutoComplete = (text: string) => {
    const stopChar = ' ,.;|/?？。，；';
    let index = text.length - 1;
    for (; index > 0; index--) {
        const element = text[index];
        if (stopChar.includes(element)) break;
    }
    // console.log(index);

    return [text.slice(0, index), text.slice(index)];
};

export const ContentEditable = (props: {
    value: Atom<string>;
    disabled?: boolean;
    onChange?: (e: Event) => void;
    onBlur?: (e: Event) => void;
    onKeyUp?: (e: Event) => void;
    onKeyDown?: (e: Event) => void;
}) => {
    const ref = atom<HTMLElement | null>(null);

    const infoList = resource(
        async () => {
            const [originText, prompt] = splitTextToAutoComplete(props.value());
            if (!prompt) return [];
            return fetch('https://able-hare-95.deno.dev/complete/google?q=' + prompt)
                .then<[[string][]]>((res) => res.json())
                .then(([res]) => {
                    return res.map((i) => [i[0], originText]);
                });
        },
        { immediately: false, initValue: [], deps: [DebounceAtom(props.value, 300)] }
    );
    const visible = reflect(() => !!infoList().length);
    return (
        <div class="flex items-center gap-2 bg-slate-800 px-2">
            <div>📄</div>
            <FloatPanel
                class="flex-1"
                disabled={true}
                visible={visible}
                popup={({ show }) => {
                    const focusing = atom(0);

                    return (
                        <Show when={show()}>
                            <ul class="mt-2 w-full max-w-sm rounded-md bg-slate-900 p-2 text-slate-300">
                                <For each={infoList()}>
                                    {([item, originText], index) => {
                                        let it!: HTMLLIElement;
                                        return (
                                            <li
                                                ref={it}
                                                class="pl-2 hover:bg-slate-700"
                                                classList={{
                                                    'bg-slate-700': focusing() === index(),
                                                }}
                                                onclick={(e) => {
                                                    infoList([]);
                                                    props.value(originText + it.textContent + ' ');
                                                }}
                                            >
                                                <span innerHTML={item}></span>
                                            </li>
                                        );
                                    }}
                                </For>
                            </ul>
                        </Show>
                    );
                }}
            >
                <input
                    class="w-full flex-1 bg-slate-800 outline-none"
                    ref={ref}
                    oninput={(e) => props.value((e.target as any).value)}
                    onBlur={props.onBlur}
                    onKeyUp={props.onKeyUp}
                    onKeyDown={props.onKeyDown}
                    contentEditable={!props.disabled}
                    value={props.value()}
                ></input>
            </FloatPanel>
        </div>
    );
};
