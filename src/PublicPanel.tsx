import { atom, createIgnoreFirst } from '@cn-ui/use';
import { memoize } from 'lodash-es';
import { createEffect, createMemo, For, onMount, useContext } from 'solid-js';
import { API, StoreData } from './api/notion';
import { Data } from './App';
import { Panel } from './components/Panel';
import { useDatabase } from './use/useDatabase';

const getData = memoize((page: number) => API.getData(page));
export const PublicPanel = () => {
    const { publicVisible } = useContext(Data);
    const showing = atom<StoreData[]>([]);
    const page = atom<number>(0);
    createIgnoreFirst(() => {
        if (publicVisible()) {
            showing([]);
            getData(page()).then((res) => showing(res));
        }
    }, [publicVisible, page]);

    return (
        <Panel visible={publicVisible}>
            <header class="w-full text-center font-bold">公共区域</header>
            <main class="flex-1">
                {showing().length === 0 && (
                    <div class="flex h-full w-full items-center justify-center">
                        <span>加载中</span>
                    </div>
                )}
                <For each={showing()}>
                    {(item) => {
                        return <div>{item.username}</div>;
                    }}
                </For>
            </main>
            {/* <footer class=" flex w-full items-center justify-between bg-gray-700 p-2 font-bold">
                <button class="btn"> 上一页</button>
                {page()}
                <button class="btn"> 下一页</button>
            </footer> */}
        </Panel>
    );
};
