import { reflect, resource } from '@cn-ui/reactive';
import { For } from 'solid-js';
import { isServer } from 'solid-js/web';
import { AV } from '../../api/cloud';
const defaultEngineMessage: MeiliStat[] = [];

interface Usage {
    document_count: {
        current: number;
        limit: number;
        usage_percentage: number;
        above_limit: number;
        usage_status: string;
    };
    search_request_count: {
        current: number;
        limit: number;
        usage_percentage: number;
        above_limit: number;
        usage_status: string;
    };
    quantity: number;
    unit_price: number;
    total_cost: number;
    units: number;
    usage_status: string;
}

interface MeiliStat {
    id: number;
    name: string;
    url: string;
    project_uid: string;
    ms_version: string;
    is_test: boolean;
    user_id: number;
    created_at: string;
    terminated_at: string | null;
    current_state: string;
    blocked_at: string | null;
    first_indexation: string;
    first_search: string;
    resource: {
        id: number;
        name: string;
        price_usd: number;
        active: boolean;
        plan: string;
    };
    region: {
        id: number;
        name: string;
    };
    usage: Usage;
}
export function MeiliStat() {
    const SearchEngine = resource<typeof defaultEngineMessage>(
        () => {
            return new AV.Query('stats')
                .limit(1)
                .equalTo('from', 'meili')
                .find()
                .then((res) => res[0].toJSON().data)
                .then<MeiliStat[]>((res) => {
                    return JSON.parse(res).flatMap((i: any[]) => {
                        if (!i) return [];
                        return i;
                    });
                })
                .then((res) => {
                    console.log(res);
                    return res;
                });
        },
        { immediately: !isServer, initValue: defaultEngineMessage }
    );
    const Count = reflect(() => {
        const used = SearchEngine().reduce((a, i) => a + i.usage.search_request_count.current, 0);
        const total = SearchEngine().reduce((a, i) => a + i.usage.search_request_count.limit, 0);
        const per = (used * 100) / (total || 1);
        return { used, total, per };
    });
    return (
        <section>
            <header class="flex items-center justify-center gap-2 pt-12 text-2xl text-pink-400">
                搜索引擎
                <a href="https://www.meilisearch.com/">
                    <img src="https://img.shields.io/badge/PowerBy-MeiliSearch-ff69b4" alt="" />
                </a>
            </header>
            <ul class="flex flex-col justify-evenly gap-2">
                <aside class="grid grid-flow-col">
                    <label>
                        总使用量：
                        {Count().used}/{Count().total}
                        <progress max="100" value={Count().per}></progress>({Count().per.toFixed(2)}
                        %)
                    </label>
                </aside>
                <For each={SearchEngine()}>
                    {(item) => {
                        const used = item.usage.search_request_count.current;
                        const total = item.usage.search_request_count.limit;
                        return (
                            <li class="rounded-md p-2 text-xs transition-all hover:bg-slate-700">
                                <header class="grid grid-flow-col text-sm">
                                    <span>{item.id}号机</span>

                                    <span>{item.region.name}</span>
                                    <a href={item.url}>前往查看 ➡️ </a>
                                </header>

                                <nav class="grid grid-flow-col">
                                    <nav>状态：{item.current_state}</nav>
                                    <label>
                                        使用量 {used}/{total}：
                                    </label>
                                    <label>
                                        <progress max="100" value={(used * 100) / total}></progress>
                                        ({((used * 100) / total).toFixed(2)}%)
                                    </label>
                                </nav>
                            </li>
                        );
                    }}
                </For>
            </ul>
        </section>
    );
}
