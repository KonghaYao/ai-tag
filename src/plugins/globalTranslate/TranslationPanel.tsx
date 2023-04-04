import { Atom, atom, reflect, resource } from '@cn-ui/use';
import { For, JSXElement, batch, children, createEffect, onMount } from 'solid-js';
import { GlobalPlugin } from '../GlobalPlugin';
import { Translate } from '.';
import { AC } from '../../components/AC';
import { debounce } from 'lodash-es';
export const Select = (props: {
    value: Atom<string>;
    options: { value: string; label?: string }[];
}) => {
    return (
        <select
            class="bg-slate-900"
            value={props.value()}
            onchange={(e) => {
                /** @ts-ignore */
                props.value(e.target.val);
            }}
        >
            <For each={props.options}>
                {(item) => {
                    return <option value={item.value}>{item.label ?? item.value}</option>;
                }}
            </For>
        </select>
    );
};

/**
 * @example const app = useBlackBoard(BD,'keyName'); app().function()
 */
export const TranslationPanel = () => {
    console.log('Plugin Check');
    const show = atom(false);
    const disabled = reflect(() => !show());
    const input = atom('');
    const data = resource(
        () => {
            return Translate(input(), source(), target());
        },
        { deps: [input], immediately: false }
    );
    const source = atom('en');
    const target = atom('zh');
    const langs = [
        { value: 'zh', label: '英语' },
        { value: 'en', label: '简中' },
    ];
    let hovering = false;
    const delayClose = debounce(() => {
        !hovering && show(false);
    }, 3000);
    createEffect(() => data.isReady() && delayClose());
    GlobalPlugin.register('translation', {
        show,
        translate: debounce((text) => {
            batch(() => {
                show(true);
                input(text);
            });
        }, 500),
    });

    return (
        <Portal mount={'#main-panel'}>
            <nav
                // 动画很碍眼，故删除
                class="absolute  z-20 max-w-xs  translate-x-[-100%] rounded-md bg-slate-700/80 ring-2  ring-slate-600 "
                classList={{ hidden: !show() }}
                onmouseenter={() => {
                    disabled(true);
                    hovering = true;
                    delayClose();
                }}
                onmouseleave={() => {
                    disabled(false);
                    hovering = false;
                    delayClose();
                }}
                style={{
                    right: '0.5rem',
                    top: '0.5rem',
                }}
            >
                <header class="flex border-b border-slate-400 px-2 py-1 text-sm">
                    <div>魔导翻译器</div>
                    <div class="flex-1"></div>
                    <button class="btn" onclick={() => show(false)}>
                        x
                    </button>
                </header>
                <div class="flex justify-between gap-2 py-1">
                    <Select value={source} options={langs}></Select>
                    <button
                        class="btn"
                        onClick={() => {
                            batch(() => {
                                const a = target();
                                target(source());
                                source(a);
                                data.refetch();
                            });
                        }}
                    >
                        ♾️
                    </button>
                    <Select value={target} options={langs}></Select>
                </div>
                <AC resource={data}>
                    <p class="whitespace-pre-wrap p-2" style="word-break: break-all;">
                        {data()}
                    </p>
                </AC>
            </nav>
        </Portal>
    );
};
/** ! Solid 官方的 Portal 不支持同树 挂载所以很寄，不如自己写一个。。。 */
export const Portal = (props: { children: JSXElement; mount: string }) => {
    const dom = children(() => props.children).toArray();

    onMount(() => {
        console.log('render');
        const root = document.querySelector(props.mount);
        if (root) {
            dom.forEach((i) => {
                root.appendChild(i as any);
            });
        } else {
            throw new Error('dom Not Found');
        }
    });
    return '';
};
