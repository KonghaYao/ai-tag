import { DebounceAtom, atom, reflect, resource } from '@cn-ui/reactive';
import { PromptStoreAPI } from '../api/prompt-store';
import { For } from 'solid-js';
enum PromptType {
    'Mid Journey',
    'Stable Diffusion',
}

export const PromptStore = () => {
    const searchText = atom('');
    const PromptType = atom<number>(1);

    const data = resource(
        () => {
            return PromptStoreAPI.searchPrompt(searchText() || 'high', PromptType());
        },
        { initValue: [], deps: [DebounceAtom(searchText, 300)] }
    );

    return (
        <section class="flex flex-col gap-2 overflow-hidden">
            <header class="text-center text-xl">魔咒数据库</header>
            <input
                class="bg-slate-800 p-2 outline-none"
                type="text"
                placeholder="搜索英文关键词，不支持中文"
                value={searchText()}
                oninput={(e) => searchText((e.target as any).value)}
            />
            <div class="bg-green-800 text-center text-slate-100">
                仅支持英文，选中文本，拖进编辑器即可🚀！
            </div>
            <nav class="flex flex-1 overflow-auto">
                <ul>
                    <For each={data()}>
                        {(item) => {
                            return (
                                <li class=" flex select-text px-2 py-1 text-xs ">
                                    <aside class="flex flex-col p-1 ">
                                        <span>📄</span>
                                    </aside>
                                    <p>{JSON.parse(item.prompt)}</p>
                                </li>
                            );
                        }}
                    </For>
                </ul>
            </nav>
        </section>
    );
};
