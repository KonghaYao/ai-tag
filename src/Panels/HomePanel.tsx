import { For, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { WebViewLink } from './Webview';

const Translators = [{ name: 'Bing 翻译', src: 'https://cn.bing.com/translator/' }];

const EnableSites = [
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

export const LocalPower = [
    { name: t('home.btn.Setting'), src: 'setting', icon: 'settings' },
    { name: t('home.btn.Gallery'), src: 'gallery', icon: 'photo' },
    { name: t('home.btn.feedback'), src: 'feedback', icon: 'email' },
    { name: t('home.btn.ai_prompt'), src: 'ai-prompt', icon: '😄' },
    { name: t('home.btn.prompt_extractor'), src: 'prompt-extractor', icon: 'wallpaper' },
    { name: t('toolbar1.Share'), src: 'uploader', icon: 'backup' },
];
export const HomePanel = () => {
    const { visibleId } = useContext(Data);
    return (
        <Panel id="">
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">
                {t('home.title.home')}
            </header>
            <div class="h-full w-full p-4 font-thin">
                <p class="text-center text-yellow-600"> {t('home.hint.clickBelow')}</p>

                <div class="py-2 font-bold text-yellow-500"> {t('home.title.localFunc')}</div>

                <div class="flex flex-wrap gap-1 ">
                    <For each={LocalPower}>
                        {(item, index) => (
                            <div
                                class="cursor-pointer rounded-sm px-2 py-1 text-white transition-all hover:brightness-90"
                                style={{
                                    'background-color': `hwb(${index() * 20}deg 9% 21%)`,
                                }}
                                onclick={() => visibleId(item.src)}
                            >
                                {item.name}
                            </div>
                        )}
                    </For>
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
        </Panel>
    );
};
