import { reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { AIImageInfo } from 'prompt-extractor';
import { Component, For, Show, useContext } from 'solid-js';
import { GalleryGlobal } from '../App';
import { GalleryPanel } from '../components/GalleryPanel';

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
                <main class="z-10 flex h-full flex-col  gap-4 overflow-auto p-4  sm:flex-row">
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
export const AIImageInfoShower: Component<{
    data: () => AIImageInfo;
}> = (props) => {
    const details = props.data;
    const Comment = reflect(() => {
        return Object.assign({}, details()?.Comment);
    });
    return (
        <>
            {details().Software && (
                <nav class="flex justify-between rounded-lg bg-emerald-700 px-2">
                    软件：{details().Software}
                </nav>
            )}
            <nav class="flex flex-col rounded-lg bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between rounded-lg bg-emerald-800  px-2">
                    <span>正面魔咒</span>
                    <div class="font-icon " onclick={() => copy(details().Description)}>
                        copy
                    </div>
                </nav>
                <code class="" onclick={() => copy(details().Description)}>
                    {details().Description}
                </code>
            </nav>
            <div class="flex flex-col rounded-lg bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between rounded-lg bg-emerald-800 px-2">
                    <span>负面魔咒</span>
                    <div class="font-icon " onclick={() => copy(Comment().uc)}>
                        copy
                    </div>
                </nav>
                <code class="" onclick={() => copy(Comment().uc)}>
                    {Comment().uc ?? '未知'}
                </code>
            </div>

            <nav class="flex flex-col justify-between gap-2 rounded-lg bg-emerald-700 px-2">
                <header class="my-1 flex justify-between rounded-lg bg-emerald-800 px-2 text-center">
                    参数
                </header>

                <For each={Object.entries(Comment())}>
                    {([key, value]) => {
                        if (key === 'uc') return null;
                        return (
                            <div class="flex justify-between gap-2">
                                <span>{key}： </span>
                                <span>{value as string}</span>
                            </div>
                        );
                    }}
                </For>
            </nav>
            <Show when={details().others}>
                <nav class="flex flex-col justify-between gap-2 rounded-lg bg-emerald-700 px-2">
                    <header class="my-1 flex justify-between rounded-lg bg-emerald-800 px-2 text-center">
                        其他参数
                    </header>
                    <For each={Object.entries(details().others)}>
                        {([key, value]) => {
                            return (
                                <div class="flex justify-between gap-2">
                                    <span>{key}： </span>
                                    <span>{value as string}</span>
                                </div>
                            );
                        }}
                    </For>
                </nav>
            </Show>
        </>
    );
};
