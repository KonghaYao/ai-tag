import {
    Show,
    For,
    createEffect,
    createResource,
    on,
    onMount,
    Component,
    createMemo,
} from 'solid-js';
import { StoreData, API } from '../src/api/notion';
import { Atom, atom, atomization, reflect } from '@cn-ui/use';
import { useViewer } from '../src/use/useViewer';
import { notionSearch } from '../src/utils/searchDecode';

const ScrollLoading = (cb: () => void) => {
    const ScrollEvent = (e: Event) => {
        const dom = e.target as HTMLElement;
        //文档内容实际高度（包括超出视窗的溢出部分）
        let scrollHeight = Math.max(dom.scrollHeight, dom.scrollHeight);
        //滚动条滚动距离
        let scrollTop = dom.scrollTop;
        //窗口可视范围高度
        let clientHeight = Math.min(dom.clientHeight, dom.clientHeight);
        if (clientHeight + scrollTop >= scrollHeight) {
            cb();
        }
    };
    return { ScrollEvent };
};

export const App = () => {
    const page = atom(0);
    const { ScrollEvent } = ScrollLoading(() => page((i) => i + 1));
    return (
        <main class="flex h-screen w-screen flex-col overflow-hidden text-gray-400">
            <header class="blur-background absolute top-0 left-0 z-10 w-full p-4 text-center text-xl">
                魔导绪论图库
            </header>
            <main
                class="mx-auto mt-8 grid max-w-3xl grid-cols-2 justify-items-center gap-8 overflow-auto px-8 py-16 sm:grid-cols-3 md:grid-cols-4"
                onScroll={ScrollEvent}
            >
                <Gallery page={page}></Gallery>
            </main>
        </main>
    );
};

export const Gallery: Component<{ page: Atom<number> }> = (props) => {
    const { replaceImages, getViewer } = useViewer();

    const page = atomization(props.page);

    const searchText = atom('');
    const showingData = atom<StoreData[][]>([]);
    const loadMore = async () => {
        const LoadingPage = page();
        let filters = searchText() ? notionSearch(searchText(), ['username', 'tags']) : [];
        return API.getData(LoadingPage, false, filters, false)
            .then((arr) => {
                replaceImages(
                    arr.map((i) => {
                        return {
                            alt: i.description,
                            src: i.image,
                            origin: i.image.replace('/t/', '/s/'),
                        };
                    })
                );
                return arr;
            })
            .then((res) => {
                showingData((i) => {
                    i[LoadingPage] = res;
                    return [...i];
                });
            });
    };

    const refetchData = () => {
        page(0);
        /** 写掉缓存 */
        API.start_cursor = [];
        loadMore();
    };

    createEffect(on(page, (index) => loadMore()));
    createEffect(on(searchText, (text) => text === '' && loadMore()));

    return (
        <For each={createMemo(() => showingData().flat())()} fallback={<div>结果为空</div>}>
            {(item, index) => {
                return (
                    <div class=" flex w-fit flex-col">
                        <div
                            class=" m-auto h-40 w-40 cursor-pointer overflow-hidden rounded-md border-2 border-gray-500 shadow-lg transition-transform duration-500 hover:-translate-y-4 hover:scale-125"
                            onclick={() => getViewer().view(index())}
                        >
                            {item.image ? (
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    class="h-full w-full  object-cover "
                                    alt=""
                                    style={{
                                        'min-height': '100%',
                                        'min-width': '100%',
                                    }}
                                />
                            ) : (
                                <div>暂无图片</div>
                            )}
                        </div>
                        <div class="flex w-full flex-col items-center justify-between">
                            <div class="py-1 font-bold line-clamp-1">{item.description}</div>
                            <div class="h-fit text-xs line-clamp-1">{item.username}</div>
                        </div>
                    </div>
                );
            }}
        </For>
    );
};
