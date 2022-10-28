import { For, useContext } from 'solid-js';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { useWebView, WebViewLink } from './Webview';

const EnableSites = [
    {
        name: 'Novel AI 教程',
        src: 'https://www.yuque.com/longyuye/lmgcwy',
    },
    { name: '元素法典', src: 'https://docs.qq.com/doc/DWHl3am5Zb05QbGVs' },
    { name: '图片解析魔咒', src: 'https://spell.novelai.dev/' },
    { name: '魔咒百科词典', src: 'https://aitag.top/' },
    { name: 'NovelAi-魔导学概论', src: 'https://noveltags.com/' },
];

export const HomePanel = () => {
    const { isPanelVisible, r18Mode, visibleId, lists, usersCollection } = useContext(Data);
    return (
        <Panel id="">
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">
                Side APP 功能测试
            </header>
            <div class="h-full w-full p-4 font-thin">
                <p class="indent-2 text-yellow-600">
                    点击 设置，画廊，分享 等功能，面板将出现在这里！在设置中可以调回浮窗模式！
                </p>
                <p class="indent-2">
                    Side APP
                    功能是微模块（非微前端）技术测试实践，采用多种方式复合资源模块，现在正在测试中。
                </p>
                <p class="indent-2">
                    在 PC 端，我采用了 Side + Main Page
                    的渲染方式提供侧边栏，侧边栏可以展示一些小组件，方便扩展功能。同时，在移动端采用浮窗，以减小对屏幕的占用。
                </p>

                <div class="font-bold text-yellow-500">
                    下面是外部窗口测试，你可以查看这些大佬的魔咒网页
                </div>
                <div class="flex flex-col">
                    <For each={EnableSites}>
                        {(item) => <WebViewLink href={item.src}>{item.name}</WebViewLink>}
                    </For>
                </div>
            </div>
        </Panel>
    );
};
