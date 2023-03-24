import { asyncLock, atom, useEffectWithoutFirst } from '@cn-ui/use';
import { ExposeToGlobal } from './GlobalData';
import { useViewer } from '../use/useViewer';
import { API, StoreData } from '../api/notion';
import { Notice } from '../utils/notice';
import { createEffect, on } from 'solid-js';
import { usePaginationStack } from '../Panels/artist/usePaginationStack';
import { getImagePath, getImagePathBackup } from '../app/gallery/Panels/Detail';

export type IGalleryStore = ReturnType<typeof initGalleryStore>;
export const initGalleryStore = ExposeToGlobal('gallery', () => {
    const { replaceImages, getViewer } = useViewer();
    const r18 = new URLSearchParams(location.search).get('r18');
    const end = atom(false);
    const searchText = atom('');

    const { dataSlices, next, currentIndex, resetStack } = usePaginationStack(
        async (page, maxPage) => {
            if (end()) return [] as StoreData[];
            console.info(page);
            return API.getData(page, !!r18, (q) => {
                if (searchText()) {
                    q.contains('description', searchText());
                }
            }).then((res) => {
                maxPage(page + 2);
                if (res.length === 0) end(true);
                return res;
            });
        }
    );
    createEffect(() => {
        replaceImages(
            dataSlices().flatMap((i) => {
                return i.map((i) => {
                    return {
                        alt: i.description,
                        src: getImagePathBackup(i!.image, 'q=50'),
                        origin: getImagePath(i!.image)!,
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
    createEffect(() => {
        console.log(currentIndex());
    });
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
