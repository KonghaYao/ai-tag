import { Show, createSelector, createContext } from 'solid-js';
import { Atom, atom } from '@cn-ui/use';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import type { StoreData } from '../../api/notion';
import { keepStore } from '../../use/useStorage';
import { Background } from '../../components/Background';
import { SearchBar } from './SearchBar';
import { FloatPanelWithAnimate, Tabs } from '@cn-ui/core';
import { Animate } from '@cn-ui/animate';
import './index.css';
import { UploadPanel } from '../../Panels/UploadPanel';
import { Notice } from '../../utils/notice';
import { initGalleryStore } from '../../store/GalleryStore';

export const App = () => {
    const username = atom('');
    keepStore('username', username, true);
    const backgroundImage = atom('');
    keepStore('gallery:backgroundImage', backgroundImage, true);
    initGalleryStore();

    const visibleId = atom('');

    const showSearch = atom(false);
    return (
        <main class="font-global absolute top-0 left-0 z-10 flex h-screen w-screen flex-col overflow-hidden text-gray-200">
            <Background image={backgroundImage()}></Background>
            <header class=" absolute top-0 left-0 z-10   w-full p-2 text-xl sm:p-4 ">
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
                            <div class="font-icon cursor-pointer px-2">search</div>
                        </FloatPanelWithAnimate>
                        <div
                            class="font-icon cursor-pointer px-2"
                            onclick={() => visibleId('uploader')}
                        >
                            upload
                        </div>
                    </nav>
                </div>
            </header>

            <Gallery></Gallery>
            <Tabs activeId={visibleId} lazyload>
                <Animate group anime="jumpFromBottom" appear>
                    <DetailPanel></DetailPanel>

                    <UploadPanel></UploadPanel>
                </Animate>
            </Tabs>
        </main>
    );
};
