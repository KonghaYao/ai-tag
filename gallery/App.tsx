import { Show, createResource, onMount, createSelector, useContext, createContext } from 'solid-js';
import { Atom, atom, reflect, useSingleAsync } from '@cn-ui/use';
import { PanelContext } from '../src/components/Panel';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { StoreData } from '../src/api/notion';
import { useGalleryInfo } from './useGalleryInfo';

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
        ShowingPicture: Atom<null | StoreData>;
    } & ReturnType<typeof useGalleryInfo>
>();

export const App = () => {
    const galleryInfo = useGalleryInfo();
    const { ScrollEvent } = ScrollLoading(useSingleAsync(() => galleryInfo.page((i) => i + 1)));
    const visibleId = atom('');

    const ShowingPicture = atom<null | StoreData>(null);
    return (
        <GalleryGlobal.Provider
            value={{
                ShowingPicture,
                ...galleryInfo,
            }}
        >
            <PanelContext.Provider
                value={{
                    visibleId,
                    isPanelVisible: createSelector(visibleId),
                }}
            >
                <main class="font-global flex h-screen w-screen flex-col overflow-hidden text-gray-400">
                    <header class="blur-background absolute top-0 left-0 z-10 w-full p-4 text-center text-xl">
                        魔导绪论图库
                    </header>
                    <main
                        class="mx-auto mt-8 grid max-w-3xl grid-cols-2 justify-items-center gap-8 overflow-auto px-8 py-16 sm:grid-cols-3 md:grid-cols-4"
                        onScroll={ScrollEvent}
                    >
                        <Gallery></Gallery>
                    </main>
                    <DetailPanel></DetailPanel>
                </main>
            </PanelContext.Provider>
        </GalleryGlobal.Provider>
    );
};
