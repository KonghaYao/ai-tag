import { For, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import { Data, IData } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import { untrack } from 'solid-js/web';
import { sampleSize as _sampleSize } from 'lodash-es';

/** 重新设计的随机函数 */
const sampleSize = (list: IData[], size: number) => {
    const one = _sampleSize(list.slice(0, 1000), Math.ceil(size / 4));
    const two = _sampleSize(list.slice(1000, 10000), Math.ceil(size / 4));
    const three = _sampleSize(list.slice(10000, 20000), Math.ceil(size / 4));
    const four = _sampleSize(list.slice(20000), Math.ceil(size / 4));
    return [...one, ...two, ...three, ...four];
};

export const SearchBox = () => {
    const { usersCollection, result, lists, searchText, r18Mode, tagsPerPage } = useContext(Data);

    const showingResult = reflect(() => {
        const num = untrack(tagsPerPage);
        if (r18Mode()) return result().slice(0, num);
        return (
            result()
                .filter((i) => !i.r18)
                .slice(0, num) || []
        );
    });
    return (
        <>
            <nav class="flex w-full items-center">
                <input
                    class="my-4 mr-4 flex-1 rounded-lg bg-gray-700 px-4 py-1 text-gray-200 shadow-md outline-none"
                    value={searchText()}
                    placeholder="搜索关键词，中文也可以"
                    oninput={debounce((e) => {
                        searchText(e.target.value);
                    }, 300)}
                ></input>

                <span class="btn" onclick={() => searchText('')}>
                    清除
                </span>
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
                            result(sampleSize(lists(), tagsPerPage()));
                        }}
                    >
                        随机 {tagsPerPage()}
                    </span>
                </nav>
                <section class="my-2 flex h-full flex-wrap items-start  overflow-y-auto overflow-x-hidden">
                    <For each={showingResult()}>
                        {(item) => (
                            <TagButton
                                data={item}
                                onClick={(item) => usersCollection((i) => [...i, item])}
                            ></TagButton>
                        )}
                    </For>
                </section>
            </section>
        </>
    );
};
