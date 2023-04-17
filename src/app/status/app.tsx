import { resource } from '@cn-ui/reactive';
import { JSXElement, Show, lazy, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
const defaultValue = {
    bounces: { value: 0, change: 0 },
    pageviews: { value: 10, change: 10 },
    totaltime: { value: 992, change: 992 },
    uniques: { value: 1, change: 1 },
};

import { MeiliStat } from './MeiliStat';
import { Webview } from '../../Panels/Webview';
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

    return (
        <section class="flex h-screen w-screen flex-col items-center overflow-auto">
            <nav class="font-global flex w-full max-w-6xl  flex-col gap-4 py-12 text-center">
                <header class=" mb-4  text-2xl">
                    📊魔导绪论 数据统计站
                    <sup class="mx-4 text-sm text-yellow-600">24小时内</sup>
                </header>
                <a href="https://analytics.umami.is/share/7vG3EWy6X6ZE8B68">详细情况➡️</a>
                <main class="flex flex-col gap-2">
                    <nav class="flex justify-evenly gap-2">
                        <ItemBlock val={data().pageviews}>访问量</ItemBlock>
                        <ItemBlock val={data().bounces}>跳出数</ItemBlock>
                        <ItemBlock val={data().uniques}>访客</ItemBlock>
                        <ItemBlock val={data().totaltime}>停留时间</ItemBlock>
                    </nav>
                    <MeiliStat></MeiliStat>
                    <GithubRepoStats></GithubRepoStats>
                </main>
            </nav>
        </section>
    );
};

const GithubRepoStats = () => {
    return (
        <iframe
            class="min-h-[60vh] rounded-lg"
            src="https://repo-tracker.com/r/gh/KonghaYao/ai-tag"
        ></iframe>
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
