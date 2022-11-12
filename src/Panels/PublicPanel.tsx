import { atom } from '@cn-ui/use';
import { debounce } from 'lodash-es';
import { createEffect, createMemo, createResource, For, on, Show, useContext } from 'solid-js';
import { API, StoreData } from '../api/notion';
import { Data } from '../App';
import { Panel, PanelContext } from '../components/Panel';
import { stringToTags } from '../use/TagsConvertor';
import { useViewer } from '../use/useViewer';
import { Notice } from '../utils/notice';
import { CombineMagic } from '../utils/CombineMagic';
import { notionSearch } from '../utils/searchDecode';
import { useTranslation } from '../../i18n';

export const PublicPanel = () => {
    const { isPanelVisible } = useContext(PanelContext);
    const { r18Mode, visibleId, lists, usersCollection } = useContext(Data);
    // 更改为异步导入
    const { replaceImages, getViewer } = useViewer();

    const visible = createMemo(() => isPanelVisible('gallery'));
    const page = atom<number>(0);
    const searchText = atom('');
    const [showing, { refetch }] = createResource<StoreData[]>(() => {
        if (!visible()) return [];
        let filters = searchText() ? notionSearch(searchText(), ['username', 'tags']) : [];
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
    const { t } = useTranslation();
    return (
        <Panel id="gallery">
            <header class="flex w-full items-end justify-between p-2 text-center text-lg font-bold">
                <a href="./gallery.html">
                    <div class="btn float-right cursor-pointer px-2 text-sm text-green-700">
                        {t('publicPanel.hint.gotoSite')}
                    </div>
                </a>
                <div class="flex-none"> {t('publicPanel.hint.gallery')}</div>
                <div
                    class="btn float-right cursor-pointer px-2 text-sm text-green-700"
                    onClick={() => visibleId('uploader')}
                >
                    {t('publicPanel.hint.Share')}
                </div>
            </header>

            <div class="flex p-2">
                <div class="btn  w-fit py-1 text-center text-sm">
                    <a
                        href="https://github.com/KonghaYao/ai-tag#关于社区的搜索方式"
                        target="_blank"
                    >
                        {t('publicPanel.advancedSearch')}
                    </a>
                </div>
                <input
                    placeholder={t('publicPanel.hint.searchHint')}
                    type="search"
                    class="w-full rounded-full bg-gray-700  px-4 text-sm text-gray-200 outline-none"
                    oninput={(i) => {
                        /**@ts-ignore */
                        searchText(i.target.value);
                        // changeSearch();
                    }}
                />
                <div class="btn px-2" onClick={refetchData}>
                    {t('search')}
                </div>
            </div>
            <main class="grid w-full flex-1 auto-rows-min grid-cols-2 gap-2 overflow-auto p-4 py-6">
                <Show
                    when={!showing.loading}
                    fallback={
                        <div class="flex h-full w-full items-center justify-center">
                            {showing.error ? (
                                <span>{t('error')}</span>
                            ) : (
                                <span>{t('loading')}</span>
                            )}
                        </div>
                    }
                >
                    {showing().length === 0 && <div>{t('voidResult')}</div>}
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
                                                usersCollection(stringToTags(item.tags, lists()));
                                                Notice.success(t('publicPanel.hint.CopySuccess'));
                                            }}
                                        >
                                            {t('publicPanel.CopyMagic')}
                                        </button>
                                        <button
                                            class="btn flex-none"
                                            onClick={() => {
                                                const input = stringToTags(item.tags, lists());
                                                CombineMagic(input, usersCollection);
                                                Notice.success(
                                                    t('publicPanel.hint.CombineSuccess')
                                                );
                                            }}
                                        >
                                            {t('publicPanel.CombineMagic')}
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
                    onclick={() => {
                        if (showing.loading) return;
                        if (page() > 0) {
                            page((i) => i - 1);
                        }
                    }}
                >
                    《
                </button>
                {page() + 1}
                <button
                    class="btn"
                    onclick={() => {
                        if (showing.loading) return;
                        if (API.end) {
                            Notice.error('没有更多了');
                        } else {
                            page((i) => i + 1);
                        }
                    }}
                >
                    》
                </button>
            </footer>
        </Panel>
    );
};
