import { children, Component, JSXElement } from 'solid-js';
import { atom } from '@cn-ui/use';

/** 鼠标浮动上去显示的东西 */

export const FloatPanel: Component<{ class?: string; children: JSXElement; popup: JSXElement }> = (
    props
) => {
    const el = children(() => props.children)() as HTMLElement;
    const show = atom(false);

    const mouseover = () => show(true);
    el.addEventListener('mouseover', mouseover);
    return (
        <div
            class={'relative ' + props.class ?? ''}
            onMouseLeave={() => show(false)}
            onmouseout={() => show(false)}
        >
            {el}
            <section
                class="blur-background absolute top-[150%] left-2 z-50 origin-top-left overflow-scroll rounded-md p-2 text-slate-300 ring-1 ring-gray-500 transition-transform duration-300"
                classList={{
                    'scale-0': !show(),
                    'scale-100': show(),
                }}
                onmouseover={mouseover}
            >
                {props.popup}
            </section>
        </div>
    );
};
