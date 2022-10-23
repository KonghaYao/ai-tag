import { For, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import sampleSize from 'lodash-es/sampleSize';
import { Data } from './App';
import { TagButton } from './TagButton';

export const SearchBox = () => {
    const { usersCollection, result, lists, searchText } = useContext(Data);
    return (
        <>
            <nav class="flex w-full items-center">
                <input
                    class="my-4 mr-4 flex-1 rounded-lg bg-gray-700 px-4 py-1 text-gray-200 shadow-md outline-none"
                    placeholder="搜索关键词，中文也可以"
                    oninput={debounce((e) => {
                        searchText(e.target.value);
                    }, 300)}
                ></input>
                <span
                    class="btn"
                    onclick={() => {
                        const name = searchText();
                        usersCollection((i) => [
                            ...i,
                            { cn: name, en: name, count: Infinity, r18: 0 },
                        ]);
                    }}
                >
                    创建
                </span>
            </nav>
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
                <section class="my-2 flex h-full flex-wrap items-start  overflow-y-auto overflow-x-hidden">
                    <For each={result().slice(0, 1000) || []}>
                        {(item) => (
                            <TagButton
                                data={item}
                                onClick={(item) => usersCollection((i) => [...i, item])}
                            ></TagButton>
                        )}
                    </For>
                </section>
            </section>
            {/* <noscript class="bg-red-900 bg-pink-900 bg-blue-900"></noscript> */}
        </>
    );
};
