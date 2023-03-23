import { atom } from '@cn-ui/use';
import { createEffect } from 'solid-js';

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
    html: string;
    disabled: boolean;
    onChange: (e: Event) => void;
    onBlur: (e: Event) => void;
    onKeyUp: (e: Event) => void;
    onKeyDown: (e: Event) => void;
}) => {
    const { html } = props;
    let lastHtml = '';
    const ref = atom<HTMLElement | null>(null);
    const emitChange = (originalEvt: any) => {
        const el = ref();
        if (!el) return;

        const html = el.innerHTML;
        if (props.onChange && html !== lastHtml) {
            // Clone event with Object.assign to avoid
            // "Cannot assign to read only property 'target' of object"
            const evt = Object.assign({}, originalEvt, {
                target: {
                    value: html,
                },
            });
            props.onChange(evt);
        }
        lastHtml = html;
    };
    createEffect(() => {
        const el = ref();
        if (!el) return;

        // Perhaps React (whose VDOM gets outdated because we often prevent
        // rerendering) did not update the DOM. So we update it manually now.
        if (props.html !== el.innerHTML) {
            el.innerHTML = props.html;
        }
        lastHtml = props.html;
        replaceCaret(el);
    });
    return (
        <div
            ref={ref}
            onInput={emitChange}
            onBlur={props.onBlur || emitChange}
            onKeyUp={props.onKeyUp || emitChange}
            onKeyDown={props.onKeyDown || emitChange}
            contentEditable={!props.disabled}
            innerHTML={html}
            // dangerouslySetInnerHTML={{ __html: html }}
        ></div>
    );
};
