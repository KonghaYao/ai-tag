import { createEffect, on } from 'solid-js';
import { StoreData, API } from '../src/api/notion';
import { atom, useSingleAsync } from '@cn-ui/use';
import { useViewer } from '../src/use/useViewer';
import { notionSearch } from '../src/utils/searchDecode';

export const useGalleryInfo = () => {
    const { replaceImages, getViewer } = useViewer();
    const page = atom(0);

    const searchText = atom('');
    const showingData = atom<StoreData[][]>([]);
    const loadMore = useSingleAsync(async () => {
        const LoadingPage = page();
        let filters = searchText() ? notionSearch(searchText(), ['username', 'tags']) : [];
        return API.getData(LoadingPage, false, filters, false)
            .then((res) => {
                if (res.length)
                    showingData((i) => {
                        i[LoadingPage] = res;
                        return [...i];
                    });
            })
            .then(() => {
                replaceImages(
                    showingData()
                        .flat()
                        .map((i) => {
                            return {
                                alt: i.description,
                                src: i.image,
                                origin: i.image.replace('/t/', '/s/'),
                            };
                        })
                );
            });
    });

    const refetchData = () => {
        page(0);
        /** 写掉缓存 */
        API.start_cursor = [];
        loadMore();
    };

    createEffect(on(page, (index) => loadMore()));
    createEffect(on(searchText, (text) => text === '' && loadMore()));
    return {
        page,
        searchText,
        showingData,
        getViewer,
    };
};
