import { atom, createIgnoreFirst } from '@cn-ui/use';
import { debounce, memoize, uniqBy, uniqWith } from 'lodash-es';
import { createEffect, createMemo, For, useContext } from 'solid-js';
import { API, StoreData } from '../api/notion';
import { Data, IData } from '../App';
import { Panel } from '../components/Panel';
import { stringToTags } from '../use/TagsToString';
import { useViewer } from '../use/useViewer';
import { Notice } from '../utils/notice';

/** 融合魔法 */
export const CombineMagic = (input: IData[], usersCollection: any) => {
    usersCollection((i) => {
        // 折叠融合，这样才符合 tags 的先后顺序
        const newArr = [];
        while (i.length || input.length) {
            newArr.length && newArr.push(i.shift());
            input.length && newArr.push(input.shift());
        }

        return uniqBy(
            newArr.filter((i) => i),
            (a) => a.en
        );
    });
};

const getData = memoize((page: number) => API.getData(page));
export const PublicPanel = () => {
    const { isPanelVisible, r18Mode, visibleId, lists, usersCollection } = useContext(Data);
    // 更改为异步导入
    const { replaceImages, getViewer } = useViewer();

    const visible = createMemo(() => isPanelVisible('gallery'));
    const showing = atom<StoreData[]>([]);
    const page = atom<number>(0);
    createEffect(() => {
        if (visible()) {
            showing([]);
            getData(page())
                .then((res) => (r18Mode() ? res : res.filter((i) => !i.r18)))
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
                    showing(arr);
                });
        }
    });

    return (
        <Panel id="gallery">
            <header class="w-full py-2 text-center text-lg font-bold">
                魔咒画廊
                <div
                    class="btn float-right cursor-pointer px-2 text-sm text-green-700"
                    onClick={() => visibleId('uploader')}
                >
                    我要分享
                </div>
            </header>
            <main class="grid w-full flex-1 auto-rows-min grid-cols-2 gap-2 overflow-auto p-2">
                {showing().length === 0 && (
                    <div class="flex h-full w-full items-center justify-center">
                        <span>加载中, 请稍等。</span>
                    </div>
                )}
                <For each={showing()}>
                    {(item, index) => {
                        return (
                            <div class="flex flex-col ">
                                <div
                                    class=" h-36 w-36 overflow-hidden rounded-md shadow-lg"
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
                                    <div class="h-fit text-xs line-clamp-1">{item.username}</div>
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
                                            const input = stringToTags(item.origin_tags, lists());
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
