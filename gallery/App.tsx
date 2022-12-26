import { Show, createSelector, createContext } from 'solid-js';
import { Atom, atom, reflect, useSingleAsync } from '@cn-ui/use';
import { PanelContext } from '../src/components/Panel';
import { Gallery } from './Gallery';
import { DetailPanel } from './Panels/Detail';
import { StoreData } from '../src/api/notion';
import { useGalleryInfo } from './useGalleryInfo';
import { keepStore } from '../src/use/useStorage';
import { Background } from '../src/components/Background';
import { SearchBar } from './SearchBar';
import { FloatPanel, FloatPanelWithAnimate } from '@cn-ui/core';
import { Animate } from '@cn-ui/animate';

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
                        <div class=" flex justify-between rounded-xl bg-slate-600 py-2 px-4 ">
                            <span class="flex-none">魔导绪论图库</span>
                            <FloatPanelWithAnimate
                                animateProps={{
                                    extraClass: 'animate-duration-300',
                                    anime: 'scale',
                                }}
                                popup={() => <SearchBar></SearchBar>}
                                position="br"
                            >
                                <div class="font-icon cursor-pointer px-2">search</div>
                            </FloatPanelWithAnimate>
                        </div>
                    </header>

                    <Gallery></Gallery>
                    <DetailPanel></DetailPanel>
                </main>
            </PanelContext.Provider>
        </GalleryGlobal.Provider>
    );
};
