import { atom, createIgnoreFirst, useSingleAsync } from '@cn-ui/use';
import { create, debounce, filter, memoize, uniqWith } from 'lodash-es';
import { createEffect, createMemo, createResource, For, on, Show, useContext } from 'solid-js';
import { API, StoreData } from '../api/notion';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { stringToTags } from '../use/TagsToString';
import { useViewer } from '../use/useViewer';
import { Notice } from '../utils/notice';
import { CombineMagic } from '../utils/CombineMagic';
import { notionSearch } from '../utils/searchDecode';

export const PublicPanel = () => {
    const { isPanelVisible, r18Mode, visibleId, lists, usersCollection } = useContext(Data);
    // 更改为异步导入
    const { replaceImages, getViewer } = useViewer();

    const visible = createMemo(() => isPanelVisible('gallery'));
    const page = atom<number>(0);
    const searchText = atom('');
    const [showing, { refetch }] = createResource<StoreData[]>(() => {
        if (!visible()) return [];
        let filters = searchText() ? notionSearch(searchText(), ['username', 'origin_tags']) : [];
        return API.getData(page(), r18Mode(), filters, false).then((arr) => {
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
        });
    });

    const refetchData = () => {
        if (visible()) {
            page(0);
            /** 写掉缓存 */
            API.start_cursor = [];
            refetch();
        }
    };

    createEffect(on(page, (index) => visible() && refetch()));
    createEffect(on(visible, (vis) => vis && refetch()));
    createEffect(on(searchText, (text) => text === '' && refetch()));

    /** 搜索词汇改变 */
    const changeSearch = debounce(refetchData, 1000);
    return (
        <Panel id="gallery">
            <header class="flex w-full items-end justify-between p-2 text-center text-lg font-bold">
                <span class=" text-xs font-thin">点击查看大图</span>
                魔咒画廊
                <div
                    class="btn float-right cursor-pointer px-2 text-sm text-green-700"
                    onClick={() => visibleId('uploader')}
                >
                    我要分享
                </div>
            </header>

            <div class="flex p-2">
                <div class="btn  w-fit py-1 text-center text-sm">
                    <a href="https://github.com/KonghaYao/ai-tag#关于社区的搜索方式">高级搜索</a>
                </div>
                <input
                    ref={searchText}
                    placeholder="搜索标题"
                    type="search"
                    class="w-full rounded-full bg-gray-700  px-4 text-sm text-gray-200 outline-none"
                    oninput={(i) => {
                        /**@ts-ignore */
                        searchText(i.target.value);
                        // changeSearch();
                    }}
                />
                <div class="btn px-2" onClick={refetchData}>
                    搜索
                </div>
            </div>
            <main class="grid w-full flex-1 auto-rows-min grid-cols-2 gap-2 overflow-auto p-4 py-6">
                <Show
                    when={!showing.loading}
                    fallback={
                        <div class="flex h-full w-full items-center justify-center">
                            {showing.error ? (
                                <span>加载错误了</span>
                            ) : (
                                <span>加载中, 请稍等。</span>
                            )}
                        </div>
                    }
                >
                    {showing().length === 0 && <div>结果为空</div>}
                    <For each={showing()}>
                        {(item, index) => {
                            return (
                                <div class="flex flex-col ">
                                    <div
                                        class=" m-auto h-36 w-36 overflow-hidden rounded-md shadow-lg"
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
                                    <div class="flex w-full items-center justify-between">
                                        <div class="py-1 font-bold line-clamp-1">
                                            {item.description}
                                        </div>
                                        <div class="h-fit text-xs line-clamp-1">
                                            {item.username}
                                        </div>
                                    </div>

                                    <div class="flex justify-between text-xs text-amber-400">
                                        <button
                                            class="btn flex-none"
                                            onClick={() => {
                                                usersCollection(
                                                    stringToTags(item.origin_tags, lists())
                                                );
                                                visibleId('');
                                                Notice.success('拿来成功');
                                            }}
                                        >
                                            拿来魔法
                                        </button>
                                        <button
                                            class="btn flex-none"
                                            onClick={() => {
                                                const input = stringToTags(
                                                    item.origin_tags,
                                                    lists()
                                                );
                                                CombineMagic(input, usersCollection);
                                                Notice.success('融合魔法发动，魔咒已融入');
                                            }}
                                        >
                                            融合魔法
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </Show>
            </main>

            <footer class=" flex w-full items-center justify-between bg-gray-700 p-2 font-bold">
                <button
                    class="btn"
                    onclick={debounce(() => {
                        if (page() > 0) {
                            page((i) => i - 1);
                        }
                    }, 500)}
                >
                    上一页
                </button>
                {page() + 1}
                <button
                    class="btn"
                    onclick={debounce(() => {
                        if (API.end) {
                            Notice.error('没有更多了');
                        } else {
                            page((i) => i + 1);
                        }
                    }, 500)}
                >
                    下一页
                </button>
            </footer>
        </Panel>
    );
};
