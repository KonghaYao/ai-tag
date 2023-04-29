import { DebounceAtom, asyncLock, atom, reflect, resource, usePagination } from '@cn-ui/reactive';
import { PromptStoreAPI } from '../api/prompt-store';
import { For } from 'solid-js';
enum PromptTypeEnum {
    'Mid Journey',
    'Stable Diffusion',
}

export const PromptStore = () => {
    const searchText = atom('portrait');
    const PromptType = atom<number>(1);

    const data = usePagination(
        (page, maxPage) => {
            maxPage(Infinity);
            return PromptStoreAPI.searchPrompt({
                q: searchText(),
                type: PromptType(),
                limit: 5,
                offset: page * 5,
            });
        },
        { initValue: [] }
    );

    return (
        <section class="flex flex-col gap-2 overflow-hidden">
            <header class="text-center text-xl">魔咒数据库</header>
            <nav class="flex gap-4 px-2">
                <input
                    class="flex-1 rounded-md bg-slate-700 p-2 outline-none"
                    type="text"
                    placeholder="搜索英文关键词，不支持中文"
                    value={searchText()}
                    oninput={(e) => searchText((e.target as any).value)}
                />
                <button
                    class="btn rounded-md bg-green-600 px-2 transition-colors hover:bg-green-700"
                    onclick={asyncLock(() => data.refetch())}
                >
                    🔍
                </button>
                <button
                    class="btn rounded-md bg-green-600 px-2 transition-colors hover:bg-green-700"
                    onclick={asyncLock(async () => {
                        const newPage = data.currentPage() + Math.floor(5 * Math.random() + 2);
                        data.goto(newPage);
                    })}
                >
                    🎲
                </button>
            </nav>
            <nav class="flex gap-2 px-2 text-sm">
                <div>1,506,000 条</div>
                <aside>
                    <button onclick={() => data.prev()}>◀️</button>
                    <span>{data.currentPage()}</span>
                    <button onclick={() => data.next()}>▶️</button>
                </aside>
            </nav>
            <nav class="bg-green-800 text-center text-slate-100">
                仅支持英文，选中文本，拖进编辑器即可🚀！
            </nav>

            <nav class="flex flex-1 overflow-auto">
                <ul>
                    <For each={data.currentData()}>
                        {(item) => {
                            return (
                                <li class=" flex select-text px-2 py-4 text-xs transition-colors hover:bg-slate-700">
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
