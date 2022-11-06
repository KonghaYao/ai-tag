import { For, Component, createMemo, useContext, batch } from 'solid-js';
import { PanelContext } from '../src/components/Panel';
import { GalleryGlobal } from './App';

export const Gallery: Component = (props) => {
    const { visibleId } = useContext(PanelContext);
    const { ShowingPicture, showingData, getViewer } = useContext(GalleryGlobal);

    return (
        <For each={createMemo(() => showingData().flat())()} fallback={<div>结果为空</div>}>
            {(item, index) => {
                return (
                    <div class=" flex w-fit flex-col">
                        <div
                            class=" m-auto h-40 w-40 cursor-pointer overflow-hidden rounded-md border-2 border-gray-500 shadow-lg transition-transform duration-500 hover:-translate-y-4 hover:scale-125"
                            onclick={() => {
                                batch(() => {
                                    ShowingPicture(item);
                                    visibleId('detail');
                                });
                            }}
                        >
                            {item.image ? (
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    class="h-full w-full  object-cover "
                                    alt=""
                                    style={{
                                        'min-height': '100%',
                                        'min-width': '100%',
                                    }}
                                />
                            ) : (
                                <div>暂无图片</div>
                            )}
                        </div>
                        <div class="flex w-full flex-col items-center justify-between">
                            <div class="py-1 font-bold line-clamp-1">{item.description}</div>
                            <div class="h-fit text-xs line-clamp-1">{item.username}</div>
                            <div class="btn mt-2 text-xs" onclick={() => getViewer().view(index())}>
                                查看大图
                            </div>
                        </div>
                    </div>
                );
            }}
        </For>
    );
};
