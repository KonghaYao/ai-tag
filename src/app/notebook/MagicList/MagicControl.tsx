import type { ResourceAtom } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import type { Component } from 'solid-js';
import { DragPoster } from '@cn-ui/headless';
import { Message } from '../../../components/MessageHInt';
import { Notice } from '../../../utils/notice';
import type { SingleMagic } from '../use/useIndexedDB';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import { GlobalData } from '../../../store/GlobalData';

export const MagicControl: Component<{
    data: ResourceAtom<SingleMagic>;
}> = (props) => {
    const { ChangeMagic } = GlobalData.getApp('notebook');

    return (
        <DragPoster
            send={(send, transfer) => {
                send('INPUT_MAGIC', props.data().tags);
                transfer.setData('text', props.data().tags);
                Message.success('您可以拖拽魔咒到其他页面');
            }}
        >
            <section class="flex gap-2 py-2">
                <FloatPanelWithAnimate
                    class="btn flex-1 whitespace-nowrap text-sm text-white"
                    animateProps={{ anime: 'scale' }}
                    popup={() => (
                        <div class=" pointer-events-none mt-2  w-[70vw] whitespace-pre-wrap rounded-md border border-slate-600 bg-slate-800 p-2 text-left text-sm">
                            {props.data().tags}
                        </div>
                    )}
                >
                    <span>查看魔咒</span>
                </FloatPanelWithAnimate>
                <span
                    class="font-icon btn whitespace-nowrap bg-green-600 text-sm text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        const cb = prompt('请修改魔咒', props.data().tags);
                        if (cb)
                            ChangeMagic({ ...props.data(), tags: cb })
                                .then(() => props.data.refetch())
                                .then(() => {
                                    Notice.success('修改魔咒成功');
                                });
                    }}
                >
                    ✒️
                </span>
                <span
                    class="font-icon btn mr-2 whitespace-nowrap bg-sky-600 text-sm text-white"
                    onclick={() => {
                        copy(props.data().tags);
                        Notice.success('复制成功');
                    }}
                >
                    📄
                </span>
            </section>
        </DragPoster>
    );
};
