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

export const ContentEditable = (props: {
    value: Atom<string>;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (e: Event) => void;
    onBlur?: (e: Event) => void;
    onKeyUp?: (e: Event) => void;
    onKeyDown?: (e: Event) => void;
}) => {
    const ref = atom<HTMLElement | null>(null);

    return (
        <div class="flex items-center gap-2 bg-transparent px-2">
            <div>📄</div>

            <input
                placeholder={props.placeholder ?? '在这里可以输入'}
                class="w-full flex-1 bg-transparent outline-none"
                ref={ref}
                oninput={(e) => props.value((e.target as any).value)}
                onBlur={props.onBlur}
                onKeyUp={props.onKeyUp}
                onKeyDown={props.onKeyDown}
                contentEditable={!props.disabled}
                value={props.value()}
            ></input>
        </div>
    );
};
