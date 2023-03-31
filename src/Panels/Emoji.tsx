import { DebounceAtom, atom, resource } from '@cn-ui/reactive';
import { searchEmoji } from '../api/emoji';
import { For } from 'solid-js';
import { DragPoster } from '@cn-ui/headless';

export const Emoji = () => {
    const searchText = atom('happy');
    const data = resource(
        () => {
            return searchEmoji(searchText());
        },
        { initValue: [], deps: [DebounceAtom(searchText, 300)] }
    );

    return (
        <section class="flex flex-col gap-2">
            <header class="text-center text-xl">Emoji</header>
            <input
                class="bg-slate-800 p-2 outline-none"
                type="text"
                value={searchText()}
                oninput={(e) => searchText((e.target as any).value)}
            />
            <div class="bg-green-800 text-center text-slate-100">
                仅支持英文检索，直接拖进编辑器即可🚀！
            </div>
            <nav class="flex select-text  flex-wrap gap-2 p-2 text-3xl">
                <For each={data()} fallback={<div>空</div>}>
                    {(item) => {
                        return (
                            <DragPoster send={(send) => send('ADD_BEFORE', item.emoji)}>
                                <span class="select-all">{item.emoji}</span>
                            </DragPoster>
                        );
                    }}
                </For>
            </nav>
        </section>
    );
};
