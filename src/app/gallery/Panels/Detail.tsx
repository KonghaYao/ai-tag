import { reflect } from '@cn-ui/use';
import type { AIImageInfo } from 'prompt-extractor';
import { Show, useContext } from 'solid-js';
import { AIImageInfoShower } from '../../../components/AIImageInfoShower';
import { BackupImage } from '../BackupImage';
import { GlobalData } from '../../../store/GlobalData';

export const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png');
};
export const getImagePathBackup = (s: string, tail: string) => {
    // 兼容以前的 thumbsnap 的问题
    if (s.startsWith('https://thumbsnap.com'))
        return (
            `https://ik.imagekit.io/dfidfiskkxn/save/${getImagePath(s)
                .replace(/\.\w+$/, '')
                .split('/')
                .at(-1)}?` + tail
        );
    return s + `?` + tail;
};

export const DetailPanel = () => {
    const { ShowingPicture, getViewer, replaceImages, ShowingPictureURL } =
        GlobalData.getApp('gallery');
    const { sideAppMode } = GlobalData.getApp('side-app');

    // console.log(sideAppMode());

    const details = reflect(() => {
        if (!ShowingPicture()) return null;
        const information = Object.fromEntries(
            JSON.parse(ShowingPicture()?.other || '[]')
        ) as AIImageInfo;
        if (!information.Description) {
            information.Description = ShowingPicture()!.tags;
        }
        return information;
    });
    return (
        <Show when={ShowingPicture()}>
            <section class="z-10 flex h-full flex-col items-center gap-4 overflow-auto break-words  p-2 sm:p-1">
                <nav
                    class="flex h-[30vh]  cursor-pointer flex-col items-center justify-center sm:h-full"
                    onclick={() => {
                        const { description } = ShowingPicture()!;
                        const image = ShowingPictureURL();
                        replaceImages([
                            {
                                alt: description,
                                src: image!,
                                origin: image!,
                            },
                        ]);
                        getViewer().view(0);
                    }}
                >
                    <BackupImage
                        src={getImagePathBackup(ShowingPicture()!.image, 'q=50')}
                        aspect={ShowingPicture()!.size.replace('x', '/')}
                        fallbackSrc={getImagePath(ShowingPicture()!.image)}
                    ></BackupImage>

                    <div class="btn ">点击查看大图</div>
                    <header class="my-2 w-full rounded-lg bg-lime-600 py-2 px-4 text-center text-2xl font-bold text-slate-200 line-clamp-1">
                        {ShowingPicture()!.description}
                    </header>
                </nav>
                <div class="flex w-full  flex-none flex-col gap-4  text-slate-200 sm:p-4">
                    <nav class="flex justify-between  bg-emerald-700 px-2">
                        <div>作者: {ShowingPicture()!.username}</div>
                        <div>种子号码: {ShowingPicture()!.seed}</div>
                    </nav>
                    <Show when={details()}>
                        <AIImageInfoShower data={details}></AIImageInfoShower>
                    </Show>
                </div>
            </section>
        </Show>
    );
};
