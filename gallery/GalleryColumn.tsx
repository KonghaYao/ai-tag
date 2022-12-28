import { For, Component, useContext, batch } from 'solid-js';
import { StoreData } from '../src/api/notion';
import { PanelContext } from '../src/components/Panel';
import { GalleryGlobal } from './App';
import { getImagePath } from './Panels/Detail';
import { saveAs } from 'file-saver';
import { DragPoster } from '@cn-ui/headless';

export const PictureCard: Component<StoreData & { index: number }> = (item) => {
    const { visibleId } = useContext(PanelContext);
    const { ShowingPicture, getViewer, backgroundImage, searchText } = useContext(GalleryGlobal);

    return (
        <DragPoster send={(send) => send('INPUT_MAGIC', item.tags)}>
            <div class="single-pic relative  w-full  cursor-pointer  rounded-md  shadow-lg transition-transform  duration-500 ">
                <img
                    loading="lazy"
                    src={getImagePath(item.image)}
                    class="w-full overflow-hidden rounded-lg object-cover  "
                    alt=""
                    draggable={false}
                    style={{
                        'min-height': '6rem',
                        'aspect-ratio': item.size.replace('x', '/'),
                    }}
                    onclick={() => {
                        batch(() => {
                            ShowingPicture(item);
                            visibleId('detail');
                            backgroundImage(getImagePath(item.image));
                        });
                    }}
                />
                <div
                    class="absolute top-2 right-2 h-fit cursor-pointer rounded-xl bg-lime-600  px-1  text-slate-200 line-clamp-1"
                    onclick={() => {
                        searchText(`username:${item.username}`);
                    }}
                >
                    {item.username}
                </div>
                <div class="title-item  absolute  bottom-0 left-0 flex w-full  flex-col  items-center justify-between gap-1 px-4 py-2 text-slate-700  opacity-0 sm:flex-row">
                    <div class=" w-full rounded-lg bg-slate-200  px-2  text-center line-clamp-1 ">
                        {item.description}
                    </div>

                    <nav class="flex gap-2">
                        <div
                            class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                            onclick={() => getViewer().view(item.index)}
                        >
                            photo
                        </div>
                        <div
                            class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                            onclick={async () => {
                                const data = await fetch(getImagePath(item.image)).then((res) =>
                                    res.blob()
                                );
                                saveAs(data, item.description + '-' + item.username + '.png');
                            }}
                        >
                            download
                        </div>
                    </nav>
                </div>
            </div>
        </DragPoster>
    );
};
