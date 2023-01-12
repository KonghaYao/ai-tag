import { resource } from '@cn-ui/use';
import { For, Resource, Show, useContext } from 'solid-js';
import { DropReceiver } from '@cn-ui/headless';
import { Message } from '../src/MessageHint';

import { Notice } from '../src/utils/notice';
import { NoteBookContext } from './App';
import { ExpendText } from './components/ExpendText';
import { SingleMagic, useIndexedDB } from './use/useIndexedDB';
import '@cn-ui/animate/src/scale.css';
import { MagicControl } from './MagicList/MagicControl';
import { ImageCard } from './MagicList/ImageCard';

export const MagicList = () => {
    const { IndexList, store, DeleteMagic, ChangeMagic, AddDemoImage, DeleteImage } =
        useIndexedDB();
    const { hidImage } = useContext(NoteBookContext);

    return (
        <div class="flex flex-col gap-4 overflow-y-scroll py-2">
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
                    const data = resource<SingleMagic>(() => store.getItem(item));
                    const DeleteButton = (
                        <DropReceiver
                            detect={{
                                MAGIC_IMAGE() {
                                    Message.warn('从魔咒中删除这个图片');
                                },
                            }}
                            receive={{
                                MAGIC_IMAGE(info) {
                                    DeleteImage(info.origin, info.position).then(() => {
                                        data.refetch();
                                        Notice.success('删除成功');
                                    });
                                },
                            }}
                        >
                            <div
                                class="font-icon btn bg-rose-700 text-gray-200"
                                onclick={() => {
                                    const info = confirm(
                                        `是否删除${data()?.title}\n${data()?.tags}`
                                    );
                                    if (info) {
                                        DeleteMagic(data()?.id ?? IndexList()[index()]).then(() =>
                                            Notice.success('删除成功')
                                        );
                                    }
                                }}
                            >
                                delete
                            </div>
                        </DropReceiver>
                    );
                    return (
                        <DropReceiver
                            detect={{
                                PURE_TAGS() {
                                    Message.success('松手，修改魔咒文本');
                                },
                                extra(dataTransfer: DataTransfer) {
                                    if (dataTransfer.types.includes('Files'))
                                        Message.success('添加图片到这个魔咒');
                                },
                            }}
                            receive={{
                                PURE_TAGS(tags: string) {
                                    ChangeMagic({ ...data(), tags })
                                        .then(data.refetch)
                                        .then(() => {
                                            Notice.success('修改魔咒成功');
                                        });
                                },
                                extra(_, dataTransfer: DataTransfer) {
                                    Promise.all(
                                        [...dataTransfer.files]
                                            .filter((i) => {
                                                return i.type.startsWith('image/');
                                            })
                                            .map((i) => AddDemoImage(i, data()))
                                    ).then((list) => {
                                        list.length && data.refetch();
                                    });
                                },
                            }}
                        >
                            <div class="mx-4 rounded-md bg-slate-800 p-4 ">
                                <Show when={data() === null}>
                                    <div class="flex justify-between">
                                        <span>
                                            这个区块貌似出现了 BUG，如果重新加载不行，就删除吧
                                        </span>
                                        {DeleteButton}
                                        <div
                                            class="btn bg-sky-700"
                                            onclick={() => {
                                                Notice.success('重新加载开始');
                                                data.refetch();
                                            }}
                                        >
                                            重新加载
                                        </div>
                                    </div>
                                </Show>
                                <Show when={data.isReady()} fallback={<div> 加载中</div>}>
                                    <header class="flex cursor-pointer justify-between">
                                        <div
                                            class="flex cursor-pointer items-center gap-2"
                                            title="点我修改标题"
                                            onclick={() => {
                                                const cb = prompt(
                                                    '请输入这个魔咒的名称',
                                                    data().title
                                                );
                                                if (cb)
                                                    ChangeMagic({ ...data(), title: cb }).then(
                                                        data.refetch
                                                    );
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
                                                    const cb = prompt(
                                                        '请修改描述',
                                                        data().description
                                                    );
                                                    if (cb)
                                                        ChangeMagic({
                                                            ...data(),
                                                            description: cb,
                                                        }).then(data.refetch);
                                                }}
                                            >
                                                edit
                                            </span>

                                            {data().description || '没有描述信息哦'}
                                        </span>
                                    </ExpendText>
                                    <MagicControl data={data}></MagicControl>

                                    <Show when={!hidImage()}>
                                        <div class="my-1 flex flex-nowrap gap-4 overflow-y-auto">
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
                                                        <ImageCard
                                                            data={data()}
                                                            id={id}
                                                        ></ImageCard>
                                                    );
                                                }}
                                            </For>
                                        </div>
                                    </Show>

                                    {/* 时间标记 */}
                                    <div class="flex justify-between py-1 text-xs text-gray-600">
                                        <nav>
                                            {new Date(data().create_time).toLocaleDateString()}
                                        </nav>
                                        <nav>
                                            {new Date(data().last_update).toLocaleDateString()}
                                        </nav>
                                    </div>
                                </Show>
                            </div>
                        </DropReceiver>
                    );
                }}
            </For>
        </div>
    );
};
