import { FilterBar } from './FilterBar';
import { SearchResult } from './SearchResult';
import { SearchBar } from './SearchBar';
import { useClassFilter } from './ClassFilter';
import { Show, useContext } from 'solid-js';
import { Data } from '../App';
const SearchSideBar = () => {
    const { ClassFilterList } = useClassFilter();
    return (
        <div class="flex flex-none flex-col gap-2 overflow-scroll pb-4 text-sm">
            <ClassFilterList></ClassFilterList>
        </div>
    );
};
export const SearchBox = () => {
    const { showClassify } = useContext(Data);
    return (
        <>
            <SearchBar></SearchBar>
            <section class="flex h-full w-full flex-1 flex-col gap-2 overflow-hidden">
                <FilterBar></FilterBar>
                <section class="flex flex-1 gap-2 overflow-auto">
                    <Show when={showClassify()}>
                        <SearchSideBar></SearchSideBar>
                    </Show>
                    <SearchResult></SearchResult>
                </section>
            </section>
        </>
    );
};
