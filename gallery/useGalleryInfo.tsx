import { createEffect, on } from 'solid-js';
import { StoreData, API } from '../src/api/notion';
import { atom, useSingleAsync } from '@cn-ui/use';
import { useViewer } from '../src/use/useViewer';
import { useSearchParams } from '@solidjs/router';
import { Notice } from '../src/utils/notice';
export const useGalleryInfo = () => {
    const { replaceImages, getViewer } = useViewer();
    const [searchParams] = useSearchParams();
    const currentIndex = atom(0);
    const end = atom(false);
    const searchText = atom('');
    const dataSlice = atom<StoreData[][]>([]);
    const loadMore = async (LoadingPage: number, clear = false) => {
        return API.getData(LoadingPage, !!searchParams.r18, (q) => {
            if (searchText()) {
                console.log(searchText());
                q.contains('description', searchText());
            }
        }).then((res) => {
            if (res.length) {
                dataSlice((i) => {
                    i[LoadingPage] = res;
                    return [...i];
                });
            } else {
                end(true);
                Notice.success('到底啦');
            }
            if (clear) {
                dataSlice([res]);
                clear = false;
            }
        });
    };

    createEffect(on(searchText, (text) => text === '' && loadMore(0, true)));
    return {
        page: currentIndex,
        end,
        changePage: useSingleAsync(async (number: number) => {
            if (end()) return;
            return loadMore(number).then(() => currentIndex(number));
        }),
        clearAndResearch: useSingleAsync(async () => {
            return loadMore(0, true);
        }),
        searchText,
        showingData: dataSlice,
        getViewer,
        replaceImages,
    };
};
