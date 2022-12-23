import { children, Component, JSXElement } from 'solid-js';
import { Atom, atomization } from '@cn-ui/use';

const firstTranslate = {
    l: 'right-[110%]',
    r: 'left-[110%]',
    t: 'bottom-[110%]',
    b: 'top-[110%]',
};
const secondTranslate = {
    l: 'left-0',
    r: 'right-0',
    t: 'top-0',
    b: 'bottom-0',
    m: '',
};
const usePositionString = (
    s: 'l' | 'r' | 't' | 'b' | 'tl' | 'lt' | 'lb' | 'bl' | 'br' | 'rb' | 'rt' | 'tr'
) => {
    const [first, second = 'm'] = s;
    return `${firstTranslate[first]} ${secondTranslate[second]}`;
};

/** 鼠标浮动上去显示的东西 */
export const FloatPanel: Component<{
    position?: 'l' | 'r' | 't' | 'b' | 'tl' | 'lt' | 'lb' | 'bl' | 'br' | 'rb' | 'rt' | 'tr';
    show?: boolean | Atom<boolean>;
    class?: string;
    children: JSXElement;
    popup: JSXElement;
}> = (props) => {
    const el = children(() => props.children)() as HTMLElement;
    const show = atomization(props.show ?? false);
    const mouseover = () => show(true);
    el.addEventListener('mouseover', mouseover);
    const pos = usePositionString(props.position ?? 'bl');
    return (
        <div
            class={'relative ' + props.class ?? ''}
            onMouseLeave={() => show(false)}
            onmouseout={() => show(false)}
        >
            {el}
            <section
                class="blur-background absolute  z-40  overflow-scroll rounded-md p-2 text-slate-300 shadow-md shadow-slate-700 ring-1 ring-slate-600  transition-all duration-300"
                classList={{
                    'scale-0 opacity-0': !show(),
                    'scale-100  opacity-100': show(),
                    [pos]: true,
                }}
                onmouseover={mouseover}
            >
                {props.popup}
            </section>
        </div>
    );
};
