import { Component } from 'solid-js';
import { DragPoster } from '@cn-ui/headless';
import { AsyncImage } from '../components/AsyncImage';
import { SingleMagic, useIndexedDB } from '../use/useIndexedDB';

export const ImageCard: Component<{ data: SingleMagic; id: string }> = (props) => {
    const { getImage } = useIndexedDB();
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
