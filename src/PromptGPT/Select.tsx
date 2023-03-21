import { Component, For } from 'solid-js';

export const Select: Component<{
    each: { name?: string; value: string }[];
    onChange: (text: string) => void;
}> = (props) => {
    return (
        <select
            title="默认预设"
            class=" w-5 bg-slate-600 outline-none"
            onchange={(e) => {
                props.onChange((e.target as any).value);
            }}
            value=""
        >
            <For each={props.each}>
                {(item) => {
                    return <option value={item.value}>{item.name ?? item.value}</option>;
                }}
            </For>
        </select>
    );
};
