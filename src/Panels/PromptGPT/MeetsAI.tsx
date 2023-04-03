import { DebounceAtom, atom, resource } from '@cn-ui/reactive';
import { AV } from '../../api/cloud';
import { For, Show } from 'solid-js';
import { AllModelName } from '../../api/prompt-gpt/CNModelName';
export const MeetsAI = () => {
    const funcFilter = atom('');
    const pageNum = atom(1);
    const searchText = atom('');
    const data = resource(
        () => {
            const q = new AV.Query('gpt_record')
                .addDescending('createdAt')
                .limit(10)
                .skip((pageNum() - 1) * 10);
            if (funcFilter()) q.equalTo('func', funcFilter());
            if (searchText()) q.contains('input', searchText());
            return q.findAndCount();
        },
        {
            initValue: [[], 0],
            deps: [funcFilter, pageNum, DebounceAtom(searchText, 300)],
        }
    );
    return (
        <section class="p-4 ">
            <input
                class="my-2 w-full rounded bg-slate-900 p-1"
                type="text"
                placeholder="搜索标题"
                value={searchText()}
                oninput={(e) => searchText((e.target as any).value)}
            />
            <nav class="flex justify-evenly">
                <div>总条目数：{data()[1]}</div>

                <select
                    class="bg-slate-900"
                    value={funcFilter()}
                    onchange={(e) => funcFilter((e.target as any).value)}
                >
                    <option value="">全选择</option>

                    <For each={Object.entries(AllModelName)}>
                        {([en, cn]) => {
                            return <option value={en}>{cn}</option>;
                        }}
                    </For>
                </select>
            </nav>
            <For each={data()[0]}>
                {(item) => {
                    return (
                        <details class=" border-b border-slate-500 py-1">
                            <summary class="line-clamp-2" title={item.get('input')}>
                                <span class="btn text-xs">
                                    {(AllModelName as any)[item.get('func')] as string}
                                </span>
                                {item.get('input')}
                            </summary>
                            <p class="select-text pl-4 text-sm">{item.get('result')}</p>
                        </details>
                    );
                }}
            </For>
            <nav class="flex justify-evenly py-2">
                <Show when={pageNum() > 1}>
                    <button class="btn" onclick={() => pageNum((i) => i - 1)}>
                        上一页
                    </button>
                </Show>

                <span>
                    {pageNum()}/{Math.ceil(data()[1] / 20) || 10}
                </span>
                <Show when={pageNum() < Math.ceil(data()[1] / 20)}>
                    <button class="btn" onclick={() => pageNum((i) => i + 1)}>
                        下一页
                    </button>
                </Show>
            </nav>
        </section>
    );
};
