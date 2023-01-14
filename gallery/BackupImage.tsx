import { Component } from 'solid-js';
import { atom } from '@cn-ui/use';

export const BackupImage: Component<{
    src: string;
    fallbackSrc: string;
    aspect?: string;
    onReady?: (src: string) => void;
    onClick?: (src: string) => void;
}> = (props) => {
    const error = atom(false);
    return (
        <img
            loading="lazy"
            src={error() ? props.fallbackSrc : props.src}
            class="w-full overflow-hidden rounded-lg object-cover  "
            alt=""
            draggable={false}
            style={{
                'min-height': '6rem',
                'aspect-ratio': props.aspect,
            }}
            onload={(res) => {
                props.onReady && props.onReady(error() ? props.fallbackSrc : props.src);
            }}
            onclick={() => {
                props.onClick && props.onClick(props.src);
            }}
            onerror={() => error(true)}
        />
    );
};
