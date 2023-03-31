import { Atom, atom, useEffect, useEffectWithoutFirst } from '@cn-ui/use';
import { createEffect } from 'solid-js';
import './ContentEditable.css';
export const ContentEditable = (props: {
    value: Atom<string>;
    singleRow?: boolean;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (e: Event) => void;
    onBlur?: (e: Event) => void;
    onKeyUp?: (e: Event) => void;
    onKeyDown?: (e: Event) => void;
}) => {
    const ref = atom<HTMLElement | null>(null);
    useEffect(() => {
        if (ref()) ref()!.dataset.replicatedValue = props.value();
    }, [props.value, ref]);
    return (
        <div class="textarea-wrap" ref={ref}>
            <textarea
                placeholder={props.placeholder ?? '在这里可以输入文本'}
                class="h-full w-full flex-1 bg-transparent outline-none"
                oninput={(e) => {
                    const val = (e.target as any).value;
                    props.value(val);
                }}
                onBlur={props.onBlur}
                onKeyUp={props.onKeyUp}
                onKeyDown={props.onKeyDown}
                contentEditable={!props.disabled}
                value={props.value()}
            ></textarea>
        </div>
    );
};
