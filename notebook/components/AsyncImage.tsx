import { resource } from '@cn-ui/use';
import { Component, createResource, Show } from 'solid-js';
import { useViewer } from '../../src/use/useViewer';

export const AsyncImage: Component<{
    fetch: () => Promise<string>;
}> = (props) => {
    const url = resource(props.fetch);

    const { replaceImages, getViewer } = useViewer();
    return (
        <>
            <Show when={url.isReady()} fallback="加载中">
                <img
                    draggable={false}
                    src={url()}
                    onclick={() => {
                        replaceImages([
                            {
                                src: url(),
                                origin: url(),
                                alt: url(),
                            },
                        ]);
                        getViewer().view(0);
                    }}
                    loading="lazy"
                    class="h-full w-full  object-cover "
                    alt=""
                    style={{
                        'min-height': '100%',
                        'min-width': '100%',
                    }}
                />
            </Show>
        </>
    );
};
