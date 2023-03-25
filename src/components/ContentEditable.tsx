import { Atom, atom, useEffectWithoutFirst } from '@cn-ui/use';
import { createEffect } from 'solid-js';

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
    useEffectWithoutFirst(() => {
        ref() && (ref()!.style.height = ref()!.scrollHeight + 'px');
    }, [props.value]);
    return (
        <textarea
            placeholder={props.placeholder ?? '在这里可以输入文本'}
            class="h-full w-full flex-1 bg-transparent outline-none"
            ref={ref}
            oninput={(e) => {
                props.value((e.target as any).value);
            }}
            onBlur={props.onBlur}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            contentEditable={!props.disabled}
            value={props.value()}
        ></textarea>
    );
};
