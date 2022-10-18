import { For, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import sampleSize from 'lodash-es/sampleSize';
import { Data } from './App';

export const SearchBox = () => {
    const { usersCollection, result, lists, searchText } = useContext(Data);
    return (
        <>
            <input
                class="my-4 rounded-lg bg-gray-700 px-4 py-1 text-gray-200 shadow-md outline-none"
                placeholder="搜索关键词，中文也可以"
                oninput={debounce((e) => {
                    searchText(e.target.value);
                }, 300)}
            ></input>
            <section class="flex h-full w-full flex-1 flex-col overflow-hidden">
                <nav class="flex text-gray-600">
                    <span>
                        搜索结果 {result().length} / {lists() ? lists().length : '加载中'}
                    </span>
                    <span class="flex-1"></span>
                    <span
                        class="
                    mx-1 cursor-pointer select-none rounded  border border-solid  border-gray-700 px-1 font-thin transition-colors active:bg-gray-700"
                        onclick={() => {
                            result(sampleSize(lists(), 100));
                        }}
                    >
                        随机 100
                    </span>
                </nav>
                <section class="my-2 flex h-full flex-wrap items-start overflow-auto">
                    <For each={result().slice(0, 1000) || []}>
                        {(item) => {
                            return (
                                <nav
                                    class="text-col m-2 flex cursor-pointer select-none flex-col rounded-md bg-gray-600 px-2 py-1 text-center"
                                    onclick={() => {
                                        usersCollection((i) => [...i, item]);
                                    }}
                                >
                                    <div>{item.cn}</div>
                                    <div>{item.en}</div>
                                </nav>
                            );
                        }}
                    </For>
                </section>
            </section>
        </>
    );
};
