import { atom } from '@cn-ui/use';
import { createResource, For, Show, Suspense } from 'solid-js';
import { Message, MessageHint } from '../src/MessageHint';
import { useDragAndDropData } from '../src/use/useDragAndDropData';
import { Notice } from '../src/utils/notice';
import { SingleMagic, useIndexedDB } from './use/useIndexedDB';

export const App = () => {
    const { addMagic } = useIndexedDB();
    const { receive } = useDragAndDropData();
    return (
        <main
            class="font-global flex h-screen w-screen flex-col overflow-hidden text-gray-400"
            ondragover={(e) => {
                e.preventDefault();
                // ! 注意，获取不到过程量
                Message.success('检测到拖拽');
            }}
            ondrop={(e) => {
                receive(e.dataTransfer, 'PURE_TAGS', (tags) => {
                    addMagic(tags);
                    Notice.success('创建魔咒成功');
                });
                const tags = e.dataTransfer.getData('text');
                if (tags) {
                    const isReal = confirm(`这是一个魔咒吗？\n ${tags}`);
                    if (isReal) {
                        addMagic(tags);
                        Notice.success('创建魔咒成功');
                    }
                }
            }}
        >
            <header class=" w-full p-4 text-center text-xl">
                魔咒记忆器
                <div class="text-xs text-amber-500">你可以拖拽任意的字符串到这个网站作为 TAG！</div>
            </header>
            <main class="mx-auto mt-4 flex w-full flex-col overflow-auto">
                <MagicList></MagicList>
            </main>
            <MessageHint></MessageHint>
        </main>
    );
};
const MagicList = () => {
    const { IndexList, store, DeleteMagic } = useIndexedDB();
    const { send } = useDragAndDropData();
    return (
        <div class="flex flex-col gap-4 overflow-y-scroll py-12">
            <For each={IndexList()} fallback={'您的数据为空'}>
                {(item, index) => {
                    const [data, { refetch }] = createResource<SingleMagic>(() =>
                        store.getItem(item)
                    );
                    const longText = atom(false);
                    const DeleteButton = (
                        <div
                            class="btn bg-rose-700 text-gray-200"
                            onclick={() => {
                                const info = confirm(`是否删除${data()?.title}\n${data()?.tags}`);
                                if (info) {
                                    DeleteMagic(data()?.id ?? IndexList()[index()]).then((res) => {
                                        Notice.success('删除成功');
                                    });
                                }
                            }}
                        >
                            删除
                        </div>
                    );
                    return (
                        <div class="mx-4 rounded-md bg-slate-800 p-4">
                            <Show when={data() === null}>
                                <div class="flex justify-between">
                                    <span>这个区块貌似出现了 BUG，如果重新加载不行，就删除吧</span>
                                    {DeleteButton}
                                    <div
                                        class="btn bg-sky-700"
                                        onclick={() => {
                                            Notice.success('重新加载开始');
                                            refetch();
                                        }}
                                    >
                                        重新加载
                                    </div>
                                </div>
                            </Show>
                            <Show when={data()} fallback={<div> 加载中</div>}>
                                <header class="flex justify-between">
                                    <div>{data().title}</div>

                                    <div class="flex ">
                                        <nav class="btn bg-green-700 text-gray-200">编辑</nav>
                                        {DeleteButton}
                                    </div>
                                </header>
                                <nav class="my-1 w-full bg-gray-700" style="height:1px"></nav>
                                <span
                                    class="cursor-pointer tracking-wider"
                                    classList={{
                                        'line-clamp-1': !longText(),
                                    }}
                                    onClick={() => longText((i) => !i)}
                                    draggable={true}
                                    ondragstart={(e) => {
                                        e.dataTransfer.setData('text', data().tags);
                                        send(e.dataTransfer, {
                                            type: 'INPUT_MAGIC',
                                            data: data().tags,
                                        });
                                        // Message.success('您可以拖拽魔咒到其他页面');
                                    }}
                                >
                                    {data().tags}
                                </span>
                                <div class="flex justify-between py-1 text-xs">
                                    <nav>{new Date(data().create_time).toLocaleDateString()}</nav>
                                    <nav>{new Date(data().last_update).toLocaleDateString()}</nav>
                                </div>
                            </Show>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
