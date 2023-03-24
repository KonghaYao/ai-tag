import { atom } from '@cn-ui/use';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { Background } from '../../components/Background';
import { SearchBar } from './SearchBar';
import { FloatPanelWithAnimate, Tabs } from '@cn-ui/core';

import './index.css';
import { Notice } from '../../utils/notice';
import { initGalleryStore } from '../../store/GalleryStore';
import { GlobalData } from '../../store/GlobalData';

export const GalleryRoot = () => {
    const { backgroundImage } = GlobalData.getApp('data');
    const { registerPanel, visibleId } = GlobalData.getApp('side-app');
    registerPanel('detail', DetailPanel);
    initGalleryStore();

    const showSearch = atom(false);
    return (
        <main class="font-global  flex h-screen  flex-col overflow-hidden text-gray-200">
            <Background image={backgroundImage()}></Background>
            <header class="   w-full p-2 text-xl sm:p-4 ">
                <div class=" flex justify-between rounded-xl bg-slate-600 py-2 px-4 ">
                    <span class="flex-none">
                        <a
                            class="pr-2 underline underline-offset-8 transition-colors hover:text-amber-400"
                            href="/"
                            target="_blank"
                            onClick={(e) => {
                                // 判断是否为被本应用嵌套
                                if (
                                    top &&
                                    top !== window &&
                                    top.location.origin === location.origin
                                ) {
                                    e.preventDefault();
                                    Notice.success('您已经在魔导绪论啦😄');
                                }
                            }}
                        >
                            魔导绪论
                        </a>
                        <a class="transition-colors hover:text-amber-400" href="/gallery.html">
                            图库
                        </a>
                    </span>
                    <nav class="flex gap-2">
                        <FloatPanelWithAnimate
                            disabled={showSearch}
                            animateProps={{
                                extraClass: 'animate-duration-300',
                                anime: 'scale',
                            }}
                            popup={
                                <SearchBar
                                    onfocus={() => showSearch(true)}
                                    onblur={() => showSearch(false)}
                                ></SearchBar>
                            }
                            position="br"
                        >
                            <div class="font-icon cursor-pointer px-2">🔍</div>
                        </FloatPanelWithAnimate>
                        <div
                            class="font-icon cursor-pointer px-2"
                            onclick={() => visibleId('uploader')}
                        >
                            ⬆️
                        </div>
                    </nav>
                </div>
            </header>

            <Gallery></Gallery>
        </main>
    );
};
