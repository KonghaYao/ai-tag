import { useContext } from 'solid-js';
import { useTranslation } from '../i18n';
import { Notice } from './utils/notice';
import { Data } from './App';

export function GlobalHeader() {
    const { r18Mode, visibleId } = useContext(Data);
    const { t } = useTranslation();
    return (
        <header
            class={`flex  items-baseline  rounded-lg  bg-slate-800 px-4 py-2 text-xl font-bold text-white`}
        >
            <h2 class="text-slate-200">魔导绪论</h2>
            <sup class="px-2 text-xs text-yellow-300">{__version__}</sup>
            <sub class="h-fit text-xs text-slate-200">AI 绘画三星法器</sub>
            <div class="flex-1"></div>
            <div class="flex cursor-pointer items-center  justify-center gap-2  text-xs font-thin text-[#f5f3c2]">
                {!r18Mode() && (
                    <span
                        class="btn bg-green-700"
                        onClick={() => {
                            Notice.success(t('header.hint.teen'));
                        }}
                    >
                        {t('header.TeenagerMode')}
                    </span>
                )}
                <a
                    href="https://magic-tag.notion.site/ee1a0ab136724eb183a29d1fcc56a3d2"
                    target="_blank"
                >
                    {t('header.Doc')}
                    <sup class="italic text-rose-600">NEW</sup>
                </a>

                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                    Github
                </a>

                <a href="./gallery.html" target="_blank">
                    {t('header.Gallery')}
                </a>

                <span onClick={() => visibleId('feedback')}>{t('header.FeedBack')}</span>
                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                    {'{{ By 江夏尧 }}'}
                </a>
            </div>
        </header>
    );
}
