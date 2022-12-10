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
import { ScrollLoading } from './ScrollLoading';
import { useWindowResize } from '../src/use/useWindowResize';

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

    const visibleId = atom('');
    let searchInputEl: HTMLInputElement;
    const searching = debounce(async () => {
        galleryInfo.clearAndResearch();
    }, 1000);
    const ShowingPicture = atom<null | StoreData>(null);
    const { width } = useWindowResize();
    const columns = reflect(() => {
        const w = width();
        if (w < 300) {
            return 1;
        } else if (w < 600) {
            return 2;
        } else if (w < 1200) {
            return 3;
        } else {
            return 4;
        }
    });
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
                    <header class="blur-background absolute top-0 left-0 z-10   w-full p-4 text-xl ">
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

                    <Gallery column={columns()}></Gallery>
                    <DetailPanel></DetailPanel>
                </main>
            </PanelContext.Provider>
        </GalleryGlobal.Provider>
    );
};
