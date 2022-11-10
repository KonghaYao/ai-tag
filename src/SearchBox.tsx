import { createEffect, For, on, Setter, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import { Data, IData } from './App';
import { _emColor, TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import { untrack } from 'solid-js/web';
import { sampleSize as _sampleSize } from 'lodash-es';
import { CreateIData, stringToTags } from './use/TagsConvertor';
import { useTranslation } from '../i18n';

/** 重新设计的随机函数, 很明显，数量大的 tag 的支持度更高，所以使用排序手法 */
const sampleSize = (list: IData[], size: number) => {
    const number = Math.ceil(size / 4);
    const one = _sampleSize(list.slice(0, 1000), number);
    const two = _sampleSize(list.slice(1000, 10000), number);
    const three = _sampleSize(list.slice(10000, 20000), number);
    const four = _sampleSize(list.slice(20000), number);
    return [...one, ...two, ...three, ...four].sort((a, b) => b.count - a.count);
};

export const SearchBox = () => {
    const { usersCollection, result, lists, searchText, tagsPerPage, searchNumberLimit } =
        useContext(Data);
    const showingResult = reflect(() => {
        const num = untrack(tagsPerPage);
        return result().slice(0, num);
    });

    // fixed 修复搜索完成之后没回去的问题
    let searchResult: HTMLDivElement;
    createEffect(on(showingResult, () => searchResult.scrollTo(0, 0)));

    const triggerSearch = debounce(searchText, 200) as Setter<string>;
    const { t } = useTranslation();
    return (
        <>
            <nav class="flex w-full items-center">
                <input
                    class="input my-2 mr-1 flex-1"
                    value={searchText()}
                    placeholder={t('searchBox.hint.searchPlaceholder')}
                    oninput={(e: any) => triggerSearch(e.target.value)}
                ></input>

                <span class="btn flex-none" onclick={() => triggerSearch('')}>
                    {t('searchBox.clear')}
                </span>
                <span
                    class="btn flex-none"
                    onclick={() => {
                        const name = searchText();
                        usersCollection((i) => [...i, ...stringToTags(name, lists())]);
                    }}
                >
                    {t('searchBox.create')}
                </span>
            </nav>
            <section class="flex h-full w-full flex-1 flex-col overflow-hidden">
                <nav class="flex text-sm text-gray-400">
                    <span class="flex-none">
                        {t('searchBox.searchResult')} {result().length} /
                        {lists() ? lists().length : t('loading')}
                    </span>

                    <span class="flex-1"></span>
                    <div
                        class={
                            'btn flex-none ' + _emColor[searchNumberLimit().toString().length - 1]
                        }
                        onclick={() => {
                            searchNumberLimit((i) => {
                                if (i === 0) return 10;
                                if (i === 1000000) return 0;
                                return i * 10;
                            });
                        }}
                    >
                        {searchNumberLimit() === 0
                            ? t('searchBox.NoNumberFilter')
                            : `> ${searchNumberLimit().toLocaleString('en')}`}
                    </div>
                    <span
                        class="btn flex-none bg-cyan-700"
                        onclick={() => {
                            result(sampleSize(lists(), tagsPerPage()));
                        }}
                    >
                        {t('searchBox.Random')} {tagsPerPage()}
                    </span>
                </nav>
                <section
                    class="search-results my-2 flex h-full flex-wrap items-start  overflow-y-auto overflow-x-hidden"
                    ref={searchResult}
                >
                    <For each={showingResult()}>
                        {(item) => (
                            <TagButton
                                data={item}
                                onClick={(item) =>
                                    usersCollection((i) => [...i, CreateIData(item)])
                                }
                            ></TagButton>
                        )}
                    </For>
                </section>
            </section>
        </>
    );
};
