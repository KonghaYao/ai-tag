import { SearchResult } from './SearchResult';
import { SearchBar } from './SearchBar';
import { useClassFilter } from './ClassFilter';
import { GlobalData } from '../../store/GlobalData';
export const SearchBox = () => {
    const { showClassify } = GlobalData.getApp('data')!;
    const { ClassFilterList, selectType } = useClassFilter();
    return (
        <>
            <SearchBar></SearchBar>
            <section class="flex h-full w-full flex-1 flex-col gap-2 overflow-hidden">
                {/* <FilterBar classifyType={selectType}></FilterBar> */}
                <section class="flex flex-1 overflow-auto">
                    {/* <Show when={showClassify()}>
                        <div class="flex flex-none flex-col gap-2 overflow-scroll px-2 pb-4 text-sm">
                            <ClassFilterList></ClassFilterList>
                        </div>
                    </Show> */}
                    <SearchResult></SearchResult>
                </section>
            </section>
        </>
    );
};
