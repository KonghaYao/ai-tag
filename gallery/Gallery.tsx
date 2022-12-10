import { For, Component, createMemo, useContext, batch, Switch, Match } from 'solid-js';
import { StoreData } from '../src/api/notion';
import { PanelContext } from '../src/components/Panel';
import { GalleryGlobal } from './App';
import { getImagePath } from './Panels/Detail';
import { ScrollLoading } from './ScrollLoading';
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
        <div class="mx-[5%] mt-24 flex h-full  gap-2 overflow-auto  " onScroll={ScrollEvent}>
            <For each={images()}>
                {(item) => {
                    return <GalleryColumn images={item}></GalleryColumn>;
                }}
            </For>
        </div>
    );
};
export const GalleryColumn: Component<{ images: StoreData[] }> = (props) => {
    const { visibleId } = useContext(PanelContext);
    const { ShowingPicture, getViewer, backgroundImage } = useContext(GalleryGlobal);

    return (
        <div class=" flex flex-1 flex-col gap-2 self-start">
            <For each={props.images} fallback={<div>结果为空</div>}>
                {(item, index) => {
                    return (
                        <div
                            class="single-pic relative  m-auto  cursor-pointer  rounded-md  shadow-lg transition-transform duration-500"
                            onclick={() => {
                                batch(() => {
                                    ShowingPicture(item);
                                    visibleId('detail');
                                    backgroundImage(getImagePath(item.image));
                                });
                            }}
                        >
                            <img
                                loading="lazy"
                                src={getImagePath(item.image)}
                                class="w-full  object-cover "
                                alt=""
                                style={{
                                    'min-height': '6rem',
                                }}
                            />
                            <div class="title-item  absolute  bottom-0 left-0 flex w-full flex-col items-center  justify-between bg-slate-200/80 px-4 py-2 text-slate-700">
                                <div class="py-1 font-bold line-clamp-1">{item.description}</div>
                                <div class="flex w-full flex-row items-center justify-between">
                                    <div class="h-fit text-xs line-clamp-1">{item.username}</div>
                                    <div
                                        class="font-icon cursor-pointer  text-lg"
                                        onclick={() => getViewer().view(index())}
                                    >
                                        photo
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
