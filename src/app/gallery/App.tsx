import { atom } from '@cn-ui/use';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { Background } from '../../components/Background';
import { SearchBar } from './SearchBar';
import { FloatPanelWithAnimate, Tabs } from '@cn-ui/core';

import { Notice } from '../../utils/notice';
import { initGalleryStore } from '../../store/GalleryStore';
import { GlobalData } from '../../store/GlobalData';
import { ScrollLoading } from './ScrollLoading';
import { For } from 'solid-js';

export const CategoriesBar = () => {
    const { categories } = GlobalData.getApp('gallery');

    const render = (item: string) => {
        return (
            <div
                class="btn text-xs"
                classList={{
                    'bg-green-700 text-slate-200': categories.isSelected(item),
                }}
                onclick={() => categories.changeSelected(item)}
            >
                {item}
            </div>
        );
    };
    return (
        <aside class="mb-2 flex flex-wrap gap-2 rounded-xl bg-slate-800 p-2 ">
            <For each={[...categories.activeIds().values()]}>{render}</For>
            <For
                each={[...categories.allRegistered().values()].filter(
                    (i) => !categories.isSelected(i)
                )}
            >
                {render}
            </For>
        </aside>
    );
};

export const GalleryRoot = () => {
    const { backgroundImage } = GlobalData.getApp('data');
    const { registerPanel, visibleId } = GlobalData.getApp('side-app');
    registerPanel('detail', DetailPanel);
    initGalleryStore();

    const showSearch = atom(false);

    const { page, changePage, updateCate } = GlobalData.getApp('gallery');
    updateCate();
    const { ScrollEvent } = ScrollLoading(() => changePage(page() + 1));
    return (
        <main
            class="font-global scroll-none flex h-screen w-full  flex-col overflow-auto  p-4 text-gray-200 sm:p-2"
            onscroll={ScrollEvent}
        >
            <Background image={backgroundImage()}></Background>
            <header class="sticky top-0 z-40 flex w-full flex-col gap-2 pb-2 text-xl">
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
            <CategoriesBar></CategoriesBar>

            <Gallery></Gallery>
        </main>
    );
};
