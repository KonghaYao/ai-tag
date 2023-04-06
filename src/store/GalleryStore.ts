import { asyncLock, atom, useEffectWithoutFirst } from '@cn-ui/use';
import { ExposeToGlobal } from './GlobalData';
import { useViewer } from '../use/useViewer';
import { API, StoreData } from '../api/notion';
import { createEffect, on } from 'solid-js';
import { usePaginationStack } from '@cn-ui/use';

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
                    q.contains('description', searchText());
                }
            }).then((res) => {
                maxPage(page + 2);
                if (res.length === 0) end(true);
                return res;
            });
        },
        {}
    );
    createEffect(() => {
        replaceImages(
            dataSlices().flatMap((i) => {
                return i.map((i) => {
                    return {
                        alt: i.description,
                        src: i!.image + '?q=50',
                        origin: i!.image,
                    };
                });
            })
        );
    });
    const loadMore = async (_: number, clear = false) => {
        if (clear) resetStack();
        return next();
    };

    useEffectWithoutFirst((text) => text === '' && loadMore(0, true), [searchText]);

    const ShowingPicture = atom<null | StoreData>(null);
    const ShowingPictureURL = atom<null | string>(null);

    return {
        ShowingPicture,
        ShowingPictureURL,
        page: currentIndex,
        end,
        changePage: asyncLock(async (number: number) => {
            if (end()) return;
            return loadMore(number);
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
