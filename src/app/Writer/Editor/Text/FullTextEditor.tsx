import { Component, Show } from 'solid-js';
import { ContentEditable } from '../../../../components/ContentEditable';
import { Atom, DebounceAtom, reflect, resource } from '@cn-ui/use';
import { FloatPanel } from '@cn-ui/core';
import { ToolTips } from './ToolTips';
import { splitTextToAutoComplete } from '../Common/splitTextToAutoComplete';

export const FullTextEditor: Component<{
    text: Atom<string>;
    placeholder?: string;
    onConfirmEnter?: () => void;
}> = (props) => {
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
            class="flex h-full w-full items-center rounded-md py-1"
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
            <ContentEditable
                placeholder={props.placeholder}
                value={text}
                onBlur={() => {
                    visible(false);
                }}
                onKeyDown={(e: any) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        props.onConfirmEnter && props.onConfirmEnter();
                    }
                }}
            ></ContentEditable>
        </FloatPanel>
    );
};
