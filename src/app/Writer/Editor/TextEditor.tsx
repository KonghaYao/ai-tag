import { Component, For, Show, onCleanup } from 'solid-js';
import { ContentEditable } from '../../../components/ContentEditable';
import { Atom, DebounceAtom, ResourceAtom, addListener, atom, reflect, resource } from '@cn-ui/use';
import { FloatPanel } from '@cn-ui/core';
import type { Block } from '../App';

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
export const TextEditor: Component<{ block: Block }> = (props) => {
    const text = atom(props.block.content.text);
    return <FullTextEditor text={text}></FullTextEditor>;
};

const ToolTips: Component<{
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
                            ref={it}
                            class="pl-2 hover:bg-slate-700"
                            classList={{
                                'bg-slate-700': focusing() === index(),
                            }}
                            onclick={(e) => {
                                infoList([]);
                                text(originText + it.textContent + ' ');
                            }}
                        >
                            <span innerHTML={item}></span>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
};

export const FullTextEditor: Component<{ text: Atom<string>; placeholder?: string }> = (props) => {
    const { text } = props;
    const infoList = resource(
        async () => {
            const [originText, prompt] = splitTextToAutoComplete(text());
            if (!prompt) return [];
            return fetch('https://able-hare-95.deno.dev/complete/google?q=' + prompt)
                .then<[[string][]]>((res) => res.json())
                .then(([res]) => {
                    return res.map((i) => [i[0], originText]);
                });
        },
        { immediately: false, initValue: [], deps: [DebounceAtom(text, 300)] }
    );
    const visible = reflect(() => !!infoList().length);
    return (
        <FloatPanel
            disabled={true}
            visible={visible}
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <ToolTips text={text} infoList={infoList}></ToolTips>
                    </Show>
                );
            }}
        >
            <ContentEditable placeholder={props.placeholder} value={text}></ContentEditable>
        </FloatPanel>
    );
};
