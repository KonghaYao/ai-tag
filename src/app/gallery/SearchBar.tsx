import { Component, createEffect, onMount, useContext } from 'solid-js';
import { debounce } from 'lodash-es';
import { GlobalData } from '../../store/GlobalData';

export const SearchBar: Component<{
    onfocus?: () => void;
    onblur?: () => void;
}> = (props) => {
    const { clearAndResearch, searchText } = GlobalData.getApp('gallery');

    const searching = debounce(async () => {
        clearAndResearch();
    }, 1000);
    let last = searchText();
    createEffect(() => {
        if (last !== searchText()) {
            last = searchText();
            searching();
        }
    });
    let searchInputEl!: HTMLInputElement;
    return (
        <div class="flex overflow-hidden rounded-lg bg-slate-700 ">
            <input
                class="min-w-[4em] appearance-none bg-slate-700 px-4 text-sm outline-none transition-all sm:w-28  "
                classList={{
                    'sm:min-w-[20em]': !!searchText(),
                }}
                ref={searchInputEl}
                placeholder={'搜索标题'}
                type="search"
                value={searchText()}
                onfocus={() => props.onfocus && props.onfocus()}
                oninput={() => {
                    searchText(searchInputEl.value);
                }}
                onblur={() => {
                    // clearAndResearch();
                    props.onblur && props.onblur();
                }}
            />
        </div>
    );
};
