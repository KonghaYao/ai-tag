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
];

export const HomePanel = () => {
    const {} = useContext(Data);
    return (
        <Panel id="">
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">
                Side APP 功能测试
            </header>
            <div class="h-full w-full p-4 font-thin">
                <p class="text-center text-yellow-600">在设置中可以调回浮窗模式！</p>

                <div class="font-bold text-yellow-500">本地功能</div>

                <div class="flex flex-wrap gap-1 ">
                    <For each={EnableSites}>
                        {(item) => (
                            <div
                                class="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 transition-all hover:brightness-90"
                                onclick={() => {}}
                            >
                                {item.name}
                            </div>
                        )}
                    </For>
                </div>
                <div class="font-bold text-yellow-500">友情链接</div>
                <div class="flex flex-wrap gap-1 ">
                    <For each={EnableSites}>
                        {(item) => (
                            <WebViewLink href={item.src}>
                                <div class="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 transition-all hover:brightness-90">
                                    {item.name}
                                </div>
                            </WebViewLink>
                        )}
                    </For>
                </div>
            </div>
        </Panel>
    );
};
