import type { JSXElement } from 'solid-js';

export const EditorTemplate = (props: {
    sideBar: JSXElement;
    children: JSXElement;
    footer: JSXElement;
    tool: JSXElement;
}) => {
    return (
        <section class="flex items-center gap-2  rounded-xl border border-solid border-slate-600 p-2">
            <ul class="flex flex-col items-center gap-1">{props.sideBar}</ul>

            <div class="flex-1 transition-all">
                {props.children}
                {props.tool}
                <ul class="flex items-center justify-end gap-2 px-2 text-xl">{props.footer}</ul>
            </div>
        </section>
    );
};
