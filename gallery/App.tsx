import { Show, createSelector, createContext } from 'solid-js';
import { Atom, atom, reflect, useSingleAsync } from '@cn-ui/use';
import { PanelContext } from '../src/components/Panel';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { StoreData } from '../src/api/notion';
import { useGalleryInfo } from './useGalleryInfo';
import { throttle } from 'lodash-es';
import { keepStore, useStorage } from '../src/use/useStorage';
import { Background } from '../src/components/Background';
import { ScrollLoading } from './ScrollLoading';
import { useWindowResize } from '../src/use/useWindowResize';
import { SearchBar } from './SearchBar';

export const GalleryGlobal = createContext<
    {
        username: Atom<string>;
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
                username,
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
                <main class="font-global absolute top-0 left-0 z-10 flex h-screen w-screen flex-col overflow-hidden text-gray-200">
                    <header class=" absolute top-0 left-0 z-10   w-full p-4 text-xl ">
                        <div class=" flex justify-between rounded-xl bg-slate-600 py-2 px-4">
                            <span class="flex-none">魔导绪论图库</span>
                            <SearchBar></SearchBar>
                        </div>
                    </header>

                    <Gallery column={columns()}></Gallery>
                    <DetailPanel></DetailPanel>
                </main>
            </PanelContext.Provider>
        </GalleryGlobal.Provider>
    );
};
