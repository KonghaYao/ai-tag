import { children, Component, JSXElement } from 'solid-js';
import { Atom, atom, atomization } from '@cn-ui/use';

/** 鼠标浮动上去显示的东西 */

export const FloatPanel: Component<{
    show?: boolean | Atom<boolean>;
    class?: string;
    children: JSXElement;
    popup: JSXElement;
}> = (props) => {
    const el = children(() => props.children)() as HTMLElement;
    const show = atomization(props.show ?? false);

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
                class="blur-background absolute top-[150%] left-2 z-40 origin-top-left overflow-scroll rounded-md p-2 text-slate-300 shadow-md shadow-slate-700 ring-1 ring-slate-600  transition-all duration-300"
                classList={{
                    'scale-0 opacity-0': !show(),
                    'scale-100  opacity-100': show(),
                }}
                onmouseover={mouseover}
            >
                {props.popup}
            </section>
        </div>
    );
};
