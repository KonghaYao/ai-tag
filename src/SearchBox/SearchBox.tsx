import { FilterBar } from './FilterBar';
import { SearchResult } from './SearchResult';
import { SearchBar } from './SearchBar';

export const SearchBox = () => {
    return (
        <>
            <SearchBar></SearchBar>
            <section class="flex h-full w-full flex-1 flex-col gap-2 overflow-hidden">
                <FilterBar></FilterBar>
                <SearchResult></SearchResult>
            </section>
        </>
    );
};
