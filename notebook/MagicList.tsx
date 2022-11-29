import copy from 'copy-to-clipboard';
import { Component, createResource, For, JSX, Show, useContext } from 'solid-js';
import { Message } from '../src/MessageHint';
import { useDragAndDropData } from '../src/use/useDragAndDropData';
import { useViewer } from '../src/use/useViewer';
import { Notice } from '../src/utils/notice';
import { NoteBookContext } from './App';
import { AsyncImage } from './components/AsyncImage';
import { ExpendText } from './components/ExpendText';
import { SingleMagic, useIndexedDB } from './use/useIndexedDB';

export const MagicList = () => {
    const { IndexList, store, DeleteMagic, ChangeMagic, AddDemoImage, DeleteImage } =
        useIndexedDB();
    const { hidImage } = useContext(NoteBookContext);
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
                            ondragover={(e) => {
                                e.preventDefault();
                                detect(e.dataTransfer, {
                                    MAGIC_IMAGE() {
                                        Message.warn('从魔咒中删除这个图片');
                                    },
                                });
                            }}
                            ondrop={(e) => {
                                e.preventDefault();
                                receive(e.dataTransfer, 'MAGIC_IMAGE', (info) => {
                                    DeleteImage(info.origin, info.position).then(() => {
                                        refetch();
                                        Notice.success('删除成功');
                                    });
                                });
                            }}
                        >
                            删除
                        </div>
                    );
                    return (
                        <div
                            class="mx-4 rounded-md bg-slate-800 p-4 "
                            ondragenter={(e) => e.preventDefault()}
                            ondragleave={(e) => e.preventDefault()}
                            ondragexit={(e) => e.preventDefault()}
                            ondragend={(e) => e.preventDefault()}
                            ondragover={(e) => {
                                e.preventDefault();

                                detect(e.dataTransfer, {
                                    PURE_TAGS() {
                                        e.stopPropagation();
                                        Message.success('松手，修改魔咒文本');
                                    },
                                    Files() {
                                        Message.success('添加图片到这个魔咒');
                                    },
                                });
                            }}
                            ondrop={(e) => {
                                receive(e.dataTransfer, 'PURE_TAGS', (tags: string) => {
                                    e.stopPropagation();
                                    ChangeMagic({ ...data(), tags })
                                        .then(refetch)
                                        .then(() => {
                                            Notice.success('修改魔咒成功');
                                        });
                                });
                                Promise.all(
                                    [...e.dataTransfer.files]
                                        .filter((i) => {
                                            return i.type.startsWith('image/');
                                        })
                                        .map((i) => AddDemoImage(i, data()))
                                ).then((list) => {
                                    list.length && refetch();
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
                                <header class="flex cursor-pointer justify-between">
                                    <div
                                        class="flex cursor-pointer items-center gap-2"
                                        title="点我修改标题"
                                        onclick={() => {
                                            const cb = prompt('请输入这个魔咒的名称', data().title);
                                            if (cb)
                                                ChangeMagic({ ...data(), title: cb }).then(refetch);
                                        }}
                                    >
                                        <span class="font-icon">edit</span>
                                        <span>{data().title}</span>
                                    </div>

                                    <div class="flex ">{DeleteButton}</div>
                                </header>
                                <nav class="my-1 w-full bg-gray-700" style="height:1px"></nav>
                                <ExpendText open={null}>
                                    <span class="text-gray-500">
                                        <span
                                            class="font-icon btn whitespace-nowrap bg-green-600 text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const cb = prompt('请修改描述', data().description);
                                                if (cb)
                                                    ChangeMagic({
                                                        ...data(),
                                                        description: cb,
                                                    }).then(refetch);
                                            }}
                                        >
                                            edit
                                        </span>

                                        {data().description || '没有描述信息哦'}
                                    </span>
                                </ExpendText>

                                <ExpendText
                                    draggable={true}
                                    ondragstart={(e) => {
                                        e.dataTransfer.setData('text', data().tags);
                                        send(e.dataTransfer, {
                                            type: 'INPUT_MAGIC',
                                            data: data().tags,
                                        });
                                        Message.success('您可以拖拽魔咒到其他页面');
                                    }}
                                    open={null}
                                    title="点击展开，魔咒可以被拖到任何地方"
                                >
                                    <span
                                        class="font-icon btn whitespace-nowrap bg-green-600 text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const cb = prompt('请修改魔咒', data().tags);
                                            if (cb)
                                                ChangeMagic({ ...data(), tags: cb })
                                                    .then(refetch)
                                                    .then(() => {
                                                        Notice.success('修改魔咒成功');
                                                    });
                                        }}
                                    >
                                        edit
                                    </span>
                                    <span
                                        class="font-icon btn mr-2 whitespace-nowrap bg-sky-600 text-white"
                                        onclick={() => {
                                            copy(data().tags);
                                            Notice.success('复制成功');
                                        }}
                                    >
                                        copy
                                    </span>
                                    {data().tags}
                                </ExpendText>

                                <Show when={!hidImage()}>
                                    <div class="flex flex-nowrap gap-4 overflow-y-auto">
                                        <For
                                            each={data().demos}
                                            fallback={
                                                <span class="text-gray-500">
                                                    拖拽图片到这里添加
                                                </span>
                                            }
                                        >
                                            {(id) => {
                                                return (
                                                    <ImageCard data={data()} id={id}></ImageCard>
                                                );
                                            }}
                                        </For>
                                    </div>
                                </Show>

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
const ImageCard: Component<{ data: SingleMagic; id: string }> = (props) => {
    const { getImage } = useIndexedDB();
    const { send } = useDragAndDropData();
    return (
        <div
            class="h-32 w-32 flex-none cursor-pointer overflow-hidden rounded-lg"
            title="点击查看\n拖动到删除按钮删除"
            draggable={true}
            ondragstart={(e) => {
                send(e.dataTransfer, {
                    type: 'MAGIC_IMAGE',
                    data: {
                        origin: props.data,
                        position: props.id,
                    },
                });
            }}
        >
            <AsyncImage fetch={() => getImage(props.id)}></AsyncImage>
        </div>
    );
};
