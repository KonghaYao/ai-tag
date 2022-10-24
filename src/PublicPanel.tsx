import { atom, createIgnoreFirst } from '@cn-ui/use';
import { debounce, memoize } from 'lodash-es';
import { For, useContext } from 'solid-js';
import { API, StoreData } from './api/notion';
import { Data } from './App';
import { Panel } from './components/Panel';
import { injectEnArray } from './use/useDatabase';
import { Notice } from './utils/notice';

const getData = memoize((page: number) => API.getData(page));
export const PublicPanel = () => {
    const { publicVisible, r18Mode, uploaderVisible, lists, usersCollection } = useContext(Data);
    const showing = atom<StoreData[]>([]);
    const page = atom<number>(0);
    createIgnoreFirst(() => {
        if (publicVisible()) {
            showing([]);
            getData(page()).then((res) => showing(r18Mode() ? res : res.filter((i) => !i.r18)));
        }
    }, [publicVisible, page]);

    return (
        <Panel visible={publicVisible}>
            <header class="w-full py-2 text-center text-lg font-bold">
                魔咒分享
                <div
                    class="btn float-right cursor-pointer px-2 text-sm"
                    onClick={() => {
                        uploaderVisible(true);
                    }}
                >
                    我要分享
                </div>
            </header>
            <main class="grid flex-1 auto-rows-min grid-cols-2 gap-2  overflow-auto">
                {showing().length === 0 && (
                    <div class="flex h-full w-full items-center justify-center">
                        <span>加载中</span>
                    </div>
                )}
                <For each={showing()}>
                    {(item) => {
                        return (
                            <div class="flex h-64  flex-col p-2">
                                <div class="h-full overflow-hidden rounded-md shadow-lg">
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
                                    <div class="py-1 font-bold line-clamp-1">{item.username}</div>
                                    <div class="h-fit text-xs line-clamp-1">{item.description}</div>
                                </div>
                                <div class="h-4 text-xs line-clamp-1">{item.tags.join(',')}</div>
                                <button
                                    class="btn"
                                    onClick={() => {
                                        usersCollection(injectEnArray(item.tags, lists()));
                                        publicVisible(false);
                                        Notice.success('拿来成功');
                                    }}
                                >
                                    拿来魔法
                                </button>
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
