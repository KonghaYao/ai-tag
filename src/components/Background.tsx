import { reflect } from '@cn-ui/use';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

export const Background: Component<{ image?: string }> = (props) => {
    const image = reflect(() => props.image);
    return (
        <Portal mount={document.body}>
            <div class=" brightness-40 pointer-events-none fixed top-0 left-0 -z-10 h-screen w-screen opacity-40">
                {image() && (
                    <img
                        loading="lazy"
                        src={image()}
                        class="h-full w-full  object-cover "
                        alt=""
                        style={{
                            'min-height': '100%',
                            'min-width': '100%',
                        }}
                        onerror={() => image('')}
                    />
                )}
            </div>
        </Portal>
    );
};
