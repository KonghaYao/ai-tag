import { reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { For, Show, useContext } from 'solid-js';
import { GalleryGlobal } from '../App';
import { GalleryPanel } from '../components/GalleryPanel';

export const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png');
};

export const DetailPanel = () => {
    const { ShowingPicture, showingData, getViewer } = useContext(GalleryGlobal);
    const details = reflect(() => {
        return Object.fromEntries(JSON.parse(ShowingPicture()?.other || '[]'));
    });
    const Comment = reflect(() => {
        return details()?.Comment || {};
    });

    return (
        <GalleryPanel id="detail">
            <Show when={ShowingPicture()}>
                <main class="z-10 flex h-full flex-col  gap-4 overflow-auto p-4  sm:flex-row">
                    <nav
                        class="flex flex-col items-center justify-center"
                        onclick={() => {
                            getViewer().view(
                                showingData()
                                    .flat()
                                    .findIndex((i) => i === ShowingPicture())
                            );
                        }}
                    >
                        <img loading="lazy" src={getImagePath(ShowingPicture().image)} alt="" />
                    </nav>
                    <main class="flex select-text flex-col sm:overflow-hidden">
                        <header class="py-4 text-2xl font-bold text-white">
                            {ShowingPicture().description}
                        </header>
                        <main class="blur-background flex max-w-2xl flex-col gap-4 rounded-lg p-4 text-gray-400 sm:overflow-auto">
                            <header class="text-xl ">配料表</header>
                            <div>作者:{ShowingPicture().username}</div>
                            <div>种子号码:{ShowingPicture().seed}</div>
                            <div class="cursor-pointer">
                                正面魔咒 点击复制：
                                <code
                                    class="bg-gray-700"
                                    onclick={() => copy(ShowingPicture().tags)}
                                >
                                    {ShowingPicture().tags}
                                </code>
                                <a href={'./index.html#/?tags=' + ShowingPicture().tags}>
                                    <div class="btn text-xs">魔导绪论</div>
                                </a>
                            </div>
                            <div class="cursor-pointer">
                                负面魔咒 点击复制：
                                <code class="bg-gray-700" onclick={() => copy(Comment().uc)}>
                                    {Comment().uc ?? '未知'}
                                </code>
                                <a href={'./index.html#/?tags=' + Comment().uc}>
                                    <div class="btn text-xs">魔导绪论</div>
                                </a>
                            </div>
                            <div> {details().Software ?? '未知'}</div>
                            <For each={Object.entries(Comment())}>
                                {([key, value]) => {
                                    if (key === 'uc') return null;
                                    return (
                                        <div>
                                            {key}: {value as string}
                                        </div>
                                    );
                                }}
                            </For>
                        </main>
                    </main>
                </main>
            </Show>
        </GalleryPanel>
    );
};
