import { reflect } from '@cn-ui/use';
import { AIImageInfo } from 'prompt-extractor';
import { Show, useContext } from 'solid-js';
import { GalleryGlobal } from '../App';
import { GalleryPanel } from '../components/GalleryPanel';
import { AIImageInfoShower } from '../../src/components/AIImageInfoShower';

export const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png');
};

export const DetailPanel = () => {
    const { ShowingPicture, showingData, getViewer } = useContext(GalleryGlobal);
    const details = reflect(() => {
        if (!ShowingPicture()) return null;
        const information = Object.fromEntries(
            JSON.parse(ShowingPicture()?.other || '[]')
        ) as AIImageInfo;
        if (!information.Description) {
            information.Description = ShowingPicture().tags;
        }
        return information;
    });
    return (
        <GalleryPanel id="detail">
            <Show when={ShowingPicture()}>
                <main class="z-10 flex h-full flex-col  gap-4 overflow-auto break-words  p-4 sm:flex-row">
                    <nav
                        class="flex cursor-pointer flex-col items-center justify-center"
                        onclick={() => {
                            const index = showingData()
                                .flat()
                                .findIndex((i) => i.image === ShowingPicture().image);
                            console.log(index);
                            getViewer().view(index);
                        }}
                    >
                        <img loading="lazy" src={getImagePath(ShowingPicture().image)} alt="" />
                        <div class="btn ">点击查看大图</div>
                    </nav>
                    <main class="flex select-text flex-col sm:overflow-hidden">
                        <header class="my-2 rounded-lg bg-lime-600 px-4 text-center text-2xl font-bold text-slate-200">
                            {ShowingPicture().description}
                        </header>
                        <main class="blur-background flex max-w-2xl flex-col gap-4 rounded-lg p-4 text-slate-200 sm:overflow-auto">
                            <nav class="flex justify-between rounded-lg bg-emerald-700 px-2">
                                <div>作者: {ShowingPicture().username}</div>
                                <div>种子号码: {ShowingPicture().seed}</div>
                            </nav>
                            <Show when={details()}>
                                <AIImageInfoShower data={details}></AIImageInfoShower>
                            </Show>
                        </main>
                    </main>
                </main>
            </Show>
        </GalleryPanel>
    );
};
