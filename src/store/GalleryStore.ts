import { asyncLock, atom, useEffect, useEffectWithoutFirst, useSelect } from '@cn-ui/use';
import { ExposeToGlobal } from './GlobalData';
import { useViewer } from '../use/useViewer';
import { API, StoreData } from '../api/notion';
import { createEffect, on } from 'solid-js';
import { usePaginationStack } from '@cn-ui/use';
import { AV } from '../api/cloud';
export type IGalleryStore = ReturnType<typeof initGalleryStore>;
export const initGalleryStore = ExposeToGlobal('gallery', () => {
    const { replaceImages, getViewer } = useViewer();
    const r18 = new URLSearchParams(location.search).get('r18');
    const end = atom(false);
    const searchText = atom('');
    const categories = useSelect({ multi: false });
    const updateCate = () => {
        new AV.Query('gallery_category').find().then((i) => {
            i.forEach((ii) => categories.register(ii.toJSON()['categories']));
        });
    };

    const { dataSlices, next, currentIndex, resetStack } = usePaginationStack(
        async (page, maxPage) => {
            if (end()) return [] as StoreData[];
            return API.getData(page, !!r18, (q) => {
                if (searchText()) {
                    q.contains('description', searchText());
                }
                if (categories.activeIds().size > 0) {
                    q.containsAll('categories', [...categories.activeIds()]);
                }
            }).then((res) => {
                maxPage(page + 2);
                if (res.length === 0) end(true);
                return res;
            });
        },
        {}
    );
    let last = '';
    useEffectWithoutFirst(() => {
        const active = [...categories.activeIds()];
        if (last !== active.join(',')) {
            resetStack();
            last = active.join(',');
        }
    }, [categories.activeIds]);
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
        categories,
        updateCate,
        replaceImages,
    };
});
