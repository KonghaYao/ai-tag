import { useTranslation } from '../../i18n';
import { Notice } from '../../utils/notice';

import { FloatPanelWithAnimate } from '@cn-ui/core';
import { GlobalData } from '../../store/GlobalData';
export function GlobalHeader() {
    const { r18Mode } = GlobalData.getApp('data');
    const { visibleId } = GlobalData.getApp('side-app');
    const { t } = useTranslation();
    return (
        <header
            class={`flex  items-baseline  rounded-lg  bg-slate-800 px-4 py-2 text-xl font-bold text-white`}
        >
            <h2 class="text-slate-200">魔导绪论</h2>
            <sup class="px-2 text-xs text-yellow-300">{__version__}</sup>
            <div class="flex-1"></div>
            <div class="flex cursor-pointer gap-2 text-center text-xs font-thin text-[#f5f3c2]">
                <a
                    href="https://magic-tag.notion.site/ee1a0ab136724eb183a29d1fcc56a3d2"
                    target="_blank"
                >
                    {t('header.Doc')}
                    <sup class="italic text-rose-600">NEW</sup>
                </a>

                <span onClick={() => visibleId('feedback')}>{t('header.FeedBack')}</span>
                <span onClick={() => visibleId('talk')}>
                    讨论区 <sup class="italic text-rose-600">NEW</sup>
                </span>
                <FloatPanelWithAnimate
                    animateProps={{ anime: 'scale', extraClass: 'animate-duration-300' }}
                    popup={() => {
                        return (
                            <div class="blur-background pointer-events-auto mt-2 flex flex-col  gap-2 rounded-md border border-slate-500 p-2">
                                <a
                                    href={'./gallery.html#/?r18=' + (r18Mode() ? 'true' : '')}
                                    target="_blank"
                                >
                                    {t('header.Gallery')}
                                </a>
                                <a href="https://github.com/KonghaYao/ai-tag" target="_blank">
                                    Github
                                </a>
                            </div>
                        );
                    }}
                >
                    <div>{'{{ By 江夏尧 }}'}</div>
                </FloatPanelWithAnimate>
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
            </div>
        </header>
    );
}
