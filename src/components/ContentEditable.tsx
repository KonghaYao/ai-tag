import { Atom, atom } from '@cn-ui/use';

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

    return (
        <textarea
            placeholder={props.placeholder ?? '在这里可以输入文本'}
            class="w-full flex-1 bg-transparent outline-none"
            ref={ref}
            rows="1"
            oninput={(e) => {
                (e.target as any).style.height = e.target.scrollHeight + 'px';
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
