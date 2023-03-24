import { Component, batch } from 'solid-js';
import type { StoreData } from '../../api/notion';
import { getImagePath, getImagePathBackup } from './Panels/Detail';
import { saveAs } from 'file-saver';
import { DragPoster } from '@cn-ui/headless';
import { BackupImage } from './BackupImage';
import { GlobalData } from '../../store/GlobalData';

export const PictureCard: Component<StoreData & { index: number }> = (item) => {
    const { visibleId } = GlobalData.getApp('side-app');
    const { ShowingPicture, getViewer, searchText, ShowingPictureURL } =
        GlobalData.getApp('gallery');

    const { backgroundImage } = GlobalData.getApp('data');
    let tag = item.tags;
    try {
        const tags = JSON.parse(item.other ?? '{}');
        const map = new Map<string, string>(tags);
        tag = map.get('Description') || item.tags;
    } catch (e) {}
    return (
        <DragPoster send={(send) => send('INPUT_MAGIC', tag)}>
            <div class="single-pic relative  w-full  cursor-pointer  rounded-md  shadow-lg transition-transform  duration-500 ">
                {/* 展示的图片 */}
                <BackupImage
                    src={getImagePathBackup(item.image, 'q=50')}
                    aspect={item.size.replace('x', '/')}
                    fallbackSrc={getImagePath(item.image)}
                    onClick={(src) => {
                        batch(() => {
                            ShowingPicture(item);
                            visibleId('detail');
                            backgroundImage(src);
                            ShowingPictureURL(src.replace('q=50', ''));
                        });
                    }}
                ></BackupImage>

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
                        {/*  操作按钮 */}
                        <div
                            class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                            onclick={() => getViewer().view(item.index)}
                        >
                            📷
                        </div>
                        <div
                            class="font-icon h-7 w-7 cursor-pointer rounded-full bg-lime-500  text-center text-lg  text-white"
                            onclick={async () => {
                                // a 标签有下载缺陷，故采用 JS 内下载
                                const data = await fetch(getImagePath(item.image)).then((res) =>
                                    res.blob()
                                );
                                saveAs(data, item.description + '-' + item.username + '.png');
                            }}
                        >
                            📥
                        </div>
                    </nav>
                </div>
            </div>
        </DragPoster>
    );
};
