import { createEffect, on } from 'solid-js';
import { StoreData, API } from '../src/api/notion';
import { atom, useSingleAsync } from '@cn-ui/use';
import { useViewer } from '../src/use/useViewer';
import { notionSearch } from '../src/utils/searchDecode';
import { useSearchParams } from '@solidjs/router';
export const useGalleryInfo = () => {
    const { replaceImages, getViewer } = useViewer();
    const [searchParams] = useSearchParams();
    const page = atom(0);
    const end = atom(false);
    const searchText = atom('');
    const showingData = atom<StoreData[][]>([]);
    const loadMore = async (LoadingPage: number, clear = false) => {
        let filters = searchText() ? notionSearch(searchText(), ['username', 'tags']) : [];
        return API.getData(LoadingPage, !!searchParams.r18, filters, clear)
            .then((res) => {
                if (res.length) {
                    showingData((i) => {
                        i[LoadingPage] = res;
                        return [...i];
                    });
                } else if (clear) {
                    showingData([]);
                }
                end(API.end);
            })
            .then(() => {
                replaceImages(
                    showingData()
                        .flat()
                        .filter((i) => i)
                        .map((i) => {
                            return {
                                alt: i.description,
                                src: i.image,
                                origin: i.image.replace('/t/', '/s/'),
                            };
                        })
                );
            });
    };

    createEffect(on(searchText, (text) => text === '' && loadMore(0, true)));
    return {
        page,
        end,
        changePage: useSingleAsync(async (number: number) => {
            return loadMore(number).then(() => page(number));
        }),
        clearAndResearch: useSingleAsync(async () => {
            return loadMore(0, true);
        }),
        searchText,
        showingData,
        getViewer,
    };
};
