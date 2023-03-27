import type { Component } from 'solid-js';
import { DragPoster } from '@cn-ui/headless';
import { AsyncImage } from '../components/AsyncImage';
import type { SingleMagic } from '../use/useIndexedDB';
import { GlobalData } from '../../../store/GlobalData';

export const ImageCard: Component<{ data: SingleMagic; id: string }> = (props) => {
    const { getImage } = GlobalData.getApp('notebook');
    return (
        <DragPoster
            send={(send) =>
                send('MAGIC_IMAGE', {
                    origin: props.data,
                    position: props.id,
                })
            }
        >
            <div
                class="h-32 w-32 flex-none cursor-pointer overflow-hidden rounded-lg"
                title="点击查看\n拖动到删除按钮删除"
            >
                <AsyncImage fetch={() => getImage(props.id)}></AsyncImage>
            </div>
        </DragPoster>
    );
};
