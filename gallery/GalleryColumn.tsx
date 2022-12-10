import { For, Component, useContext, batch } from 'solid-js';
import { StoreData } from '../src/api/notion';
import { PanelContext } from '../src/components/Panel';
import { GalleryGlobal } from './App';
import { getImagePath } from './Panels/Detail';
import { saveAs } from 'file-saver';

export const GalleryColumn: Component<{ images: StoreData[] }> = (props) => {
    const { visibleId } = useContext(PanelContext);
    const { ShowingPicture, getViewer, backgroundImage } = useContext(GalleryGlobal);

    return (
        <div class=" flex flex-1 flex-col gap-4 self-start">
            <nav class="h-16 w-full">{/* 用于填充的方块 */}</nav>
            <For each={props.images} fallback={<div>结果为空</div>}>
                {(item, index) => {
                    return (
                        <div class="single-pic relative m-auto w-full  cursor-pointer  rounded-md  shadow-lg transition-transform  duration-500">
                            <img
                                loading="lazy"
                                src={getImagePath(item.image)}
                                class="w-full overflow-hidden rounded-lg object-cover "
                                alt=""
                                style={{
                                    'min-height': '6rem',
                                }}
                                onclick={() => {
                                    batch(() => {
                                        ShowingPicture(item);
                                        visibleId('detail');
                                        backgroundImage(getImagePath(item.image));
                                    });
                                }}
                            />
                            <div class="absolute top-2 right-2 h-fit rounded-xl bg-lime-600 px-1  text-slate-200  line-clamp-1">
                                {item.username}
                            </div>
                            <div class="title-item  absolute  bottom-0 left-0 flex w-full  items-center  justify-between px-4 py-2 text-slate-700">
                                <div class="w-fit rounded-lg bg-slate-200 px-2  text-center  line-clamp-1">
                                    {item.description}
                                </div>

                                <nav class="flex gap-2">
                                    <div
                                        class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                                        onclick={() => getViewer().view(index())}
                                    >
                                        photo
                                    </div>
                                    <div
                                        class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                                        onclick={async () => {
                                            const data = await fetch(getImagePath(item.image)).then(
                                                (res) => res.blob()
                                            );
                                            saveAs(
                                                data,
                                                item.description + '-' + item.username + '.png'
                                            );
                                        }}
                                    >
                                        download
                                    </div>
                                </nav>
                            </div>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
