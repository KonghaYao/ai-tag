import { resource } from '@cn-ui/reactive';
import { For, JSXElement, Show, lazy, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
const defaultValue = {
    bounces: { value: 0, change: 0 },
    pageviews: { value: 10, change: 10 },
    totaltime: { value: 992, change: 992 },
    uniques: { value: 1, change: 1 },
};
const defaultEngineMessage = [
    {
        databaseSize: 45801472,
        lastUpdate: '2023-03-26T04:33:16.654485223Z',
        indexes: {
            tags: {
                numberOfDocuments: 40674,
                isIndexing: false,
                fieldDistribution: { cn: 40674, count: 40674, en: 40674, id: 40674, r18: 40674 },
            },
        },
    },
];
import { AV } from '../../api/cloud';
export const StatusPage = () => {
    const lastDay = () => Date.now() - 1000 * 60 * 60 * 24;
    const data = resource<typeof defaultValue>(
        () => {
            return fetch(
                `https://tag-server.deno.dev/site/stat?start_at=${lastDay()}&end_at=${Date.now()}&unit=day`
            ).then((res) => res.json());
        },
        {
            immediately: !isServer,
            initValue: defaultValue,
        }
    );
    const AICount = resource(
        () => {
            const gpt = new AV.Query('gpt_record');
            return gpt
                .greaterThan('createdAt', new Date(lastDay()))

                .count()
                .then((res) => {
                    console.log(res);
                    return res;
                });
        },
        { immediately: !isServer, initValue: 100 }
    );
    const AITimeCount = resource(
        () => {
            const date = Date.now();
            const space = 3 * 60 * 60 * 1000;
            let all: { res: number; time: Date }[] = [];
            return [...Array(8).keys()]
                .reduce(
                    (col, i) =>
                        col.then(async () => {
                            const data = await new AV.Query('gpt_record')
                                .greaterThan('createdAt', new Date(date - space * (i + 1)))
                                .lessThan('createdAt', new Date(date - space * i))
                                .count()
                                .then((res) => {
                                    return { res, time: new Date(date - space * i) };
                                });
                            all.push(data);
                            return all;
                        }),
                    Promise.resolve(all)
                )
                .then((res) => res.reverse());
        },
        { immediately: !isServer, initValue: [] }
    );

    const SearchEngine = resource<typeof defaultEngineMessage>(
        () => {
            return fetch('https://tag-server.deno.dev/tags/search/stat').then((res) => res.json());
        },
        { immediately: !isServer, initValue: defaultEngineMessage }
    );
    return (
        <section class="flex h-screen w-screen flex-col items-center overflow-auto">
            <nav class="font-global flex w-full max-w-6xl  flex-col gap-4 py-12 text-center">
                <header class=" mb-4  text-2xl">
                    📊魔导绪论 数据统计站
                    <sup class="mx-4 text-sm">24小时内</sup>
                </header>
                <a href="https://analytics.umami.is/share/7vG3EWy6X6ZE8B68">详细情况</a>
                <main class="flex flex-col gap-2">
                    <nav class="flex justify-evenly gap-2">
                        <ItemBlock val={data().pageviews}>访问量</ItemBlock>
                        <ItemBlock val={data().bounces}>跳出数</ItemBlock>
                        <ItemBlock val={data().uniques}>访客</ItemBlock>
                        <ItemBlock val={data().totaltime}>停留时间</ItemBlock>
                    </nav>
                    <section class="flex flex-col items-center">
                        <div class="pt-12 text-2xl"> AI 功能使用</div>
                        <nav>{AICount()}次</nav>
                        <Show when={AITimeCount.isReady()}>
                            <Charts
                                y={AITimeCount().map((i) => i.res)}
                                x={AITimeCount().map((i) => i.time.toLocaleTimeString())}
                            ></Charts>
                        </Show>
                    </section>
                    <section>
                        <div class="pt-12 text-2xl">搜索引擎</div>
                        <nav class="flex flex-wrap justify-evenly gap-2">
                            <For each={SearchEngine()}>
                                {(item, index) => {
                                    return (
                                        <div class="">
                                            <div class="text-xl">{index() + 1}号机</div>
                                            <nav>词条：{item.indexes.tags.numberOfDocuments} </nav>
                                            <nav>状态：正常 </nav>
                                        </div>
                                    );
                                }}
                            </For>
                        </nav>
                    </section>
                </main>
            </nav>
        </section>
    );
};
const Charts = lazy(async () => {
    /** @ts-ignore */
    await import(/* @vite-ignore */ 'https://unpkg.com/echarts');
    return {
        default(props: { x: string[]; y: number[] }) {
            let container: HTMLDivElement;

            onMount(() => {
                /** @ts-ignore */
                var myChart = echarts.init(container);
                var option;

                option = {
                    xAxis: {
                        type: 'category',
                        data: props.x,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c}',
                    },
                    series: [
                        {
                            data: props.y,
                            type: 'line',
                        },
                    ],
                };

                option && myChart.setOption(option);
            });

            return <div style="width: 600px;height:400px;" ref={container!}></div>;
        },
    };
});
const ItemBlock = (props: { val: { value: number; change: number }; children: JSXElement }) => {
    return (
        <div>
            <span class="text-4xl">
                {props.val.value}{' '}
                <sup class="-top-6 rounded-md border border-green-700 text-sm text-green-700">
                    +{props.val.change}
                </sup>
            </span>
            <div>{props.children}</div>
        </div>
    );
};
