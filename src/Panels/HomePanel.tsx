import { For, useContext } from 'solid-js';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { useWebView, WebViewLink } from './Webview';

const EnableSites = [
    { name: 'NovelAi-魔导学概论', src: 'https://noveltags.com/' },
    {
        name: 'Novel AI 教程',
        src: 'https://www.yuque.com/longyuye/lmgcwy',
    },
    { name: '元素法典', src: 'https://docs.qq.com/doc/DWHl3am5Zb05QbGVs' },
    { name: '图片 => Tags', src: 'https://spell.novelai.dev/' },
    { name: '魔咒百科词典', src: 'https://aitag.top/' },
    { name: 'NovelAI tag生成器 V2.0', src: 'https://wolfchen.top/tag/', jump: true },
];
const LocalPower = [
    { name: '魔咒画廊', src: 'gallery' },
    { name: '三分之二魔咒生成器', src: 'random-maker' },
    { name: '反馈错误', src: 'feedback' },
];
export const HomePanel = () => {
    const { visibleId } = useContext(Data);
    return (
        <Panel id="">
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">主页</header>
            <div class="h-full w-full p-4 font-thin">
                <p class="text-center text-yellow-600">点击下面的主页即是返回</p>

                <div class="py-2 font-bold text-yellow-500">本地功能</div>

                <div class="flex flex-wrap gap-1 ">
                    <For each={LocalPower}>
                        {(item) => (
                            <div
                                class="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 transition-all hover:brightness-90"
                                onclick={() => visibleId(item.src)}
                            >
                                {item.name}
                            </div>
                        )}
                    </For>
                </div>
                <div class="py-2 font-bold text-yellow-500">友情链接</div>
                <div class="flex flex-wrap gap-1 ">
                    <For each={EnableSites}>
                        {(item) => {
                            const inner = (
                                <div class="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 text-green-500 transition-all hover:brightness-90">
                                    {item.name}
                                </div>
                            );
                            if (item.jump)
                                return (
                                    <a href={item.src} target="_blank">
                                        {inner}
                                    </a>
                                );
                            return <WebViewLink href={item.src}>{inner}</WebViewLink>;
                        }}
                    </For>
                </div>
            </div>
        </Panel>
    );
};
