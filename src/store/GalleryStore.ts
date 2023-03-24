import { asyncLock, atom } from '@cn-ui/use';
import { ExposeToGlobal } from './GlobalData';
import { useViewer } from '../use/useViewer';
import { API, StoreData } from '../api/notion';
import { Notice } from '../utils/notice';
import { createEffect, on } from 'solid-js';
import { usePaginationStack } from '../Panels/artist/usePaginationStack';

export type IGalleryStore = ReturnType<typeof initGalleryStore>;
export const initGalleryStore = ExposeToGlobal('gallery', () => {
    const { replaceImages, getViewer } = useViewer();
    const r18 = new URLSearchParams(location.search).get('r18');
    const end = atom(false);
    const searchText = atom('');

    const { dataSlices, next, currentIndex, resetStack } = usePaginationStack(
        async (page, maxPage) => {
            if (end()) return [] as StoreData[];
            return API.getData(page, !!r18, (q) => {
                if (searchText()) {
                    console.log(searchText());
                    q.contains('description', searchText());
                }
            }).then((res) => {
                maxPage(Infinity);
                return res;
            });
        }
    );
    const loadMore = async (LoadingPage: number, clear = false) => {
        if (clear) resetStack();

        return next();
    };

    createEffect(on(searchText, (text) => text === '' && loadMore(0, true)));

    const ShowingPicture = atom<null | StoreData>(null);
    const ShowingPictureURL = atom<null | string>(null);
    return {
        ShowingPicture,
        ShowingPictureURL,
        page: currentIndex,
        end,
        changePage: asyncLock(async (number: number) => {
            if (end()) return;
            return loadMore(number).then(() => currentIndex(number));
        }),
        clearAndResearch: asyncLock(async () => {
            return loadMore(0, true);
        }),
        searchText,
        showingData: dataSlices,
        getViewer,
        replaceImages,
    };
});
