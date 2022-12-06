import { Show, onMount, createSelector, useContext, createContext } from 'solid-js';
import { Atom, atom, reflect, useSingleAsync } from '@cn-ui/use';
import { PanelContext } from '../src/components/Panel';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { StoreData } from '../src/api/notion';
import { useGalleryInfo } from './useGalleryInfo';
import { debounce, throttle } from 'lodash-es';
import { keepStore, useStorage } from '../src/use/useStorage';
import { Notice } from '../src/utils/notice';
import { Background } from '../src/components/Background';

const ScrollLoading = (cb: () => void, space = 10) => {
    const ScrollEvent = (e: Event) => {
        const dom = e.target as HTMLElement;
        //文档内容实际高度（包括超出视窗的溢出部分）
        let scrollHeight = Math.max(dom.scrollHeight, dom.scrollHeight);
        //滚动条滚动距离
        let scrollTop = dom.scrollTop;
        //窗口可视范围高度
        let clientHeight = Math.min(dom.clientHeight, dom.clientHeight);
        if (clientHeight + scrollTop >= scrollHeight - 10) {
            cb();
        }
    };
    return { ScrollEvent };
};

export const GalleryGlobal = createContext<
    {
        backgroundImage: Atom<string>;
        ShowingPicture: Atom<null | StoreData>;
    } & ReturnType<typeof useGalleryInfo>
>();

export const App = () => {
    const username = atom('');
    keepStore('username', username, true);
    const backgroundImage = atom('');
    keepStore('gallery:backgroundImage', backgroundImage, true);
    const galleryInfo = useGalleryInfo();

    const { ScrollEvent } = ScrollLoading(() => galleryInfo.changePage(galleryInfo.page() + 1));
    const visibleId = atom('');
    let searchInputEl: HTMLInputElement;
    const searching = debounce(async () => {
        galleryInfo.clearAndResearch();
    }, 1000);
    const ShowingPicture = atom<null | StoreData>(null);
    return (
        <GalleryGlobal.Provider
            value={{
                ShowingPicture,
                ...galleryInfo,
                backgroundImage,
            }}
        >
            <PanelContext.Provider
                value={{
                    visibleId,
                    isPanelVisible: createSelector(visibleId),
                }}
            >
                <Background image={backgroundImage()}></Background>
                <main class="font-global absolute top-0 left-0 z-10 flex h-screen w-screen flex-col overflow-hidden text-gray-400">
                    <header class="blur-background absolute top-0 left-0 z-10  w-full p-4 text-xl ">
                        <div class=" flex justify-between rounded-xl bg-slate-700/60 py-2 px-4">
                            <span class="flex-none">魔导绪论图库</span>

                            <div class="flex  overflow-hidden rounded-lg bg-slate-700  ">
                                <input
                                    class="min-w-[4em] appearance-none bg-slate-700 px-4 text-sm outline-none transition-all sm:w-28  "
                                    classList={{
                                        'sm:min-w-[20em]': !!galleryInfo.searchText(),
                                    }}
                                    ref={searchInputEl}
                                    placeholder={'搜索标题'}
                                    type="search"
                                    value={galleryInfo.searchText()}
                                    name=""
                                    id=""
                                    oninput={() => {
                                        galleryInfo.searchText(searchInputEl.value);
                                        searching();
                                    }}
                                />
                                <div
                                    class="font-icon cursor-pointer px-2"
                                    onclick={() => {
                                        galleryInfo.clearAndResearch();
                                        Notice.success('搜索成功');
                                    }}
                                >
                                    search
                                </div>
                                <div
                                    class="font-icon cursor-pointer px-2"
                                    onclick={() => {
                                        galleryInfo.searchText(
                                            (i) => `username:=${username()} ` + i
                                        );
                                        Notice.success('添加用户检索');
                                    }}
                                >
                                    account_box
                                </div>
                            </div>
                        </div>
                    </header>

                    <main
                        class="mx-auto mt-8 grid max-w-3xl grid-cols-2 justify-items-center gap-8 overflow-auto px-8 py-16 sm:grid-cols-3 md:grid-cols-4"
                        onScroll={ScrollEvent}
                    >
                        <Gallery></Gallery>
                        {galleryInfo.end() ? null : <div>继续往下滑</div>}
                    </main>
                    <DetailPanel></DetailPanel>
                </main>
            </PanelContext.Provider>
        </GalleryGlobal.Provider>
    );
};
