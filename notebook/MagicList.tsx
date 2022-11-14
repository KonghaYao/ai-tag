import { atom } from '@cn-ui/use';
import { createResource, For, Show } from 'solid-js';
import { Message } from '../src/MessageHint';
import { useDragAndDropData } from '../src/use/useDragAndDropData';
import { Notice } from '../src/utils/notice';
import { SingleMagic, useIndexedDB } from './use/useIndexedDB';

export const MagicList = () => {
    const { IndexList, store, DeleteMagic, ChangeMagic } = useIndexedDB();
    const { send, receive, detect } = useDragAndDropData();
    return (
        <div class="flex flex-col gap-4 overflow-y-scroll py-12">
            <For
                each={IndexList()}
                fallback={
                    <div class="w-full text-center">
                        数据为空, 你可以
                        <ol class=" px-4 text-left">
                            <li>1. 直接拖拽魔咒文本到这里</li>
                            <li>2. 在魔导绪论拖拽一键复制按钮到这里</li>
                        </ol>
                    </div>
                }
            >
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
                                    DeleteMagic(data()?.id ?? IndexList()[index()]).then(() =>
                                        Notice.success('删除成功')
                                    );
                                }
                            }}
                        >
                            删除
                        </div>
                    );
                    return (
                        <div
                            class="mx-4 rounded-md bg-slate-800 p-4"
                            ondragover={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                detect(e.dataTransfer, {
                                    PURE_TAGS() {
                                        Message.success('松手，修改魔咒文本');
                                    },
                                });
                            }}
                            ondrop={(e) => {
                                e.stopPropagation();
                                receive(e.dataTransfer, 'PURE_TAGS', (tags: string) => {
                                    ChangeMagic({ ...data(), tags })
                                        .then(refetch)
                                        .then(() => {
                                            Notice.success('修改魔咒成功');
                                        });
                                });
                            }}
                        >
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
                                    <div
                                        class="cursor-default"
                                        onclick={() => {
                                            const cb = prompt('请输入这个魔咒的名称', data().title);
                                            if (cb)
                                                ChangeMagic({ ...data(), title: cb }).then(refetch);
                                        }}
                                    >
                                        {data().title}
                                    </div>

                                    <div class="flex ">{DeleteButton}</div>
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
                                        Message.success('您可以拖拽魔咒到其他页面');
                                    }}
                                    title="点击展开，魔咒可以被拖到任何地方"
                                >
                                    {data().tags}
                                </span>
                                {/* 时间标记 */}
                                <div class="flex justify-between py-1 text-xs text-gray-600">
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
