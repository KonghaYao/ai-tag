import { For, useContext } from 'solid-js';
import { useTranslation } from '../i18n';
import { Data } from '../app/main/App';
import { Panel } from '../components/Panel';
import { WebViewLink } from './Webview';
import { GlobalData } from '../store/GlobalData';
import type { PanelIds } from '../app/SideApp';

const Translators = [{ name: 'Bing 翻译', src: 'https://cn.bing.com/translator/' }];

const EnableSites = [
    { name: '魔导绪论图库', src: './gallery.html' },
    { name: 'NovelAi-魔导学概论', src: 'https://noveltags.com/' },
    {
        name: 'Novel AI 教程',
        src: 'https://www.yuque.com/longyuye/lmgcwy',
    },
    { name: 'AI绘图指南wiki', src: 'https://aiguidebook.top/' },
    { name: '图片 => Tags', src: 'https://spell.novelai.dev/' },
    { name: '魔咒百科词典', src: 'https://aitag.top/' },
    { name: 'NovelAI tag生成器 V2.0', src: 'https://wolfchen.top/tag/', jump: true },
    { name: '免费 AI 绘图', src: 'https://novelai.8zyw.cn', jump: true },
];

const { t } = useTranslation();
export const MainGridOfInner = () => {
    const { visibleId } = GlobalData.getApp('side-app');
    return (
        <For each={LocalPower}>
            {(item, index) => {
                return (
                    <div
                        class="blur-background flex cursor-pointer flex-col items-center justify-center bg-slate-800 text-slate-100 hover:brightness-90"
                        style={{
                            'background-color': `hwb(${(index() * 36) % 360}deg 20% 40%)`,
                        }}
                        onclick={() => {
                            visibleId(item.src as PanelIds);
                        }}
                    >
                        <div class="font-icon text-xl">{item.icon}</div>
                        <span class="text-sm ">{item.name}</span>
                    </div>
                );
            }}
        </For>
    );
};
export const LocalPower = [
    { name: t('home.btn.Setting'), src: 'setting', icon: 'settings' },
    { name: t('home.btn.feedback'), src: 'feedback', icon: 'email' },
    { name: t('home.btn.ai_prompt'), src: 'ai-prompt', icon: '😄' },
    { name: t('home.btn.prompt_extractor'), src: 'prompt-extractor', icon: 'wallpaper' },
    { name: t('toolbar1.Share'), src: 'uploader', icon: 'backup' },
];
export const HomePanel = () => {
    return (
        <>
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">
                {t('home.title.home')}
            </header>
            <div class="h-full w-full p-4 font-thin">
                <p class="text-center text-yellow-600"> {t('home.hint.clickBelow')}</p>

                <div class="py-2 font-bold text-yellow-500"> {t('home.title.localFunc')}</div>

                <div class="grid grid-cols-3 gap-4 ">
                    <MainGridOfInner></MainGridOfInner>
                </div>
                <div class="py-2 font-bold text-yellow-500"> {t('home.title.FriendsLink')}</div>
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
                <div class="py-2 font-bold text-yellow-500">{t('home.title.translator')}</div>
                <div class="flex flex-wrap gap-1 ">
                    <For each={Translators}>
                        {(item) => {
                            const inner = (
                                <div class="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 text-green-500 transition-all hover:brightness-90">
                                    {item.name}
                                </div>
                            );

                            return <WebViewLink href={item.src}>{inner}</WebViewLink>;
                        }}
                    </For>
                </div>
            </div>
        </>
    );
};
