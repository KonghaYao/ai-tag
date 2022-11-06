import { reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { Show, useContext } from 'solid-js';
import { GalleryGlobal } from '../App';
import { GalleryPanel } from '../components/GalleryPanel';

const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png') + '?src=ts20221106';
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
                <div class="absolute top-0 left-0 h-full w-full brightness-50 ">
                    <img
                        loading="lazy"
                        src={getImagePath(ShowingPicture().image)}
                        alt=""
                        class="h-full w-full  object-cover opacity-40"
                        style={{
                            'min-height': '100%',
                            'min-width': '100%',
                        }}
                    />
                </div>
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
                        <main class="flex max-w-2xl flex-col gap-4 rounded-lg bg-gray-800/80 p-4 text-gray-400 sm:overflow-auto">
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
                            <div>采样：{Comment().sampler ?? '未知'}</div>
                            <div>scale：{Comment().scale ?? '未知'}</div>
                            <div>steps：{Comment().steps ?? '未知'}</div>
                            <div>strength：{Comment().strength ?? '未知'}</div>
                            <div>noise：{Comment().noise ?? '未知'}</div>{' '}
                        </main>
                    </main>
                </main>
            </Show>
        </GalleryPanel>
    );
};
