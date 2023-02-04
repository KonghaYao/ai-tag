import { Component, createEffect, onMount, useContext } from 'solid-js';
import { debounce } from 'lodash-es';
import { Notice } from '../src/utils/notice';
import { useSearchParams } from '@solidjs/router';
import { GalleryGlobal } from './App';

export const SearchBar: Component<{
    onfocus?: () => void;
    onblur?: () => void;
}> = (props) => {
    const [_, setSearchParams] = useSearchParams();
    const { clearAndResearch, searchText, username } = useContext(GalleryGlobal);
    let searchInputEl: HTMLInputElement;
    const searching = debounce(async () => {
        setSearchParams({
            q: searchText(),
        });
        clearAndResearch();
    }, 1000);
    createEffect(() => {
        searchText();
        searching();
    });
    onMount(() => {
        if (_.q) {
            searchText(_.q);
        }
    });
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
                name=""
                id=""
                onfocus={() => props?.onfocus()}
                oninput={() => {
                    searchText(searchInputEl.value);
                }}
                onblur={() => {
                    clearAndResearch();
                    props?.onblur();
                }}
            />

            <div
                class="font-icon cursor-pointer px-2"
                onclick={() => {
                    searchText((i) => `username:=${username()} ` + i);
                    Notice.success('添加用户检索');
                }}
            >
                account_box
            </div>
        </div>
    );
};
