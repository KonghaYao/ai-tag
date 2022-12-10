import { For, createMemo, useContext, Switch, Match } from 'solid-js';
import { StoreData } from '../src/api/notion';
import { GalleryGlobal } from './App';
import { ScrollLoading } from './ScrollLoading';
import { GalleryColumn } from './GalleryColumn';

export const Gallery = (props) => {
    const { showingData, page, changePage } = useContext(GalleryGlobal);
    const images = createMemo(() =>
        showingData()
            .flat()
            .filter((i) => i)
            .reduce((cols, item, index) => {
                cols[index % cols.length].push(item);
                return cols;
            }, [...Array(props.column).keys()].map(() => []) as StoreData[][])
    );

    const { ScrollEvent } = ScrollLoading(() => changePage(page() + 1));
    return (
        <div class="mx-[5%]  flex h-full  gap-4 overflow-auto  " onScroll={ScrollEvent}>
            <For each={images()}>
                {(item) => {
                    return <GalleryColumn images={item}></GalleryColumn>;
                }}
            </For>
        </div>
    );
};
