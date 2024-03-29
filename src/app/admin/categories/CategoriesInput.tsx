import { DebounceAtom, atom, resource } from '@cn-ui/reactive';
import { AV } from '../../../api/cloud';
import { Component, For } from 'solid-js';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import { debounce } from 'lodash-es';

export const CategoriesInput: Component<{
    onselect: (value: string) => void;
}> = (props) => {
    const searchText = atom('');
    const data = resource(
        () => {
            const ob = new AV.Query('gallery_category');
            return ob.contains('categories', searchText()).limit(100).find();
        },
        { initValue: [], immediately: false, deps: [DebounceAtom(searchText, 300)] }
    );
    const updateData = debounce(() => data.refetch());
    return (
        <FloatPanelWithAnimate
            position="bl"
            animateProps={{ anime: 'scale' }}
            popup={() => {
                data().length === 0 && updateData();
                return (
                    <section class="w-fit rounded-lg bg-slate-900 p-2">
                        <header class="flex gap-2">
                            <button class="btn" onclick={() => props.onselect(searchText())}>
                                创建
                            </button>
                            <input
                                type="text"
                                class="w-full rounded-md bg-slate-800 px-2 py-1 outline-none"
                                placeholder="输入搜索或者创建"
                                value={searchText()}
                                oninput={(e) => searchText((e.target as any).value)}
                            />
                        </header>
                        <div class="max-h-52 overflow-auto">
                            <ul class="flex flex-col gap-1 ">
                                <For each={data()}>
                                    {(item) => {
                                        return (
                                            <li
                                                onclick={() =>
                                                    props.onselect(item.get('categories'))
                                                }
                                            >
                                                {item.get('categories')}
                                            </li>
                                        );
                                    }}
                                </For>
                            </ul>
                        </div>
                    </section>
                );
            }}
        >
            <button class="btn">+</button>
        </FloatPanelWithAnimate>
    );
};
