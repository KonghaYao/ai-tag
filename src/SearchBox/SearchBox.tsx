import { FilterBar } from './FilterBar';
import { SearchResult } from './SearchResult';
import { SearchBar } from './SearchBar';
import { useClassFilter } from './ClassFilter';
import { Show, useContext } from 'solid-js';
import { Data } from '../App';
export const SearchBox = () => {
    const { showClassify } = useContext(Data);
    const { ClassFilterList, selectType } = useClassFilter();
    return (
        <>
            <SearchBar></SearchBar>
            <section class="flex h-full w-full flex-1 flex-col gap-2 overflow-hidden">
                <FilterBar classifyType={selectType}></FilterBar>
                <section class="flex flex-1 overflow-auto">
                    <Show when={showClassify()}>
                        <div class="flex flex-none flex-col gap-2 overflow-scroll px-2 pb-4 text-sm">
                            <ClassFilterList></ClassFilterList>
                        </div>
                    </Show>
                    <SearchResult></SearchResult>
                </section>
            </section>
        </>
    );
};
