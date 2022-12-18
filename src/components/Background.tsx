import { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

export const Background: Component<{ image?: string }> = (props) => {
    return (
        <Portal mount={document.body}>
            <div class=" brightness-40 pointer-events-none fixed top-0 left-0 -z-10 h-screen w-screen opacity-60">
                {props.image && (
                    <img
                        loading="lazy"
                        src={props.image}
                        class="h-full w-full  object-cover "
                        alt=""
                        style={{
                            'min-height': '100%',
                            'min-width': '100%',
                        }}
                    />
                )}
            </div>
        </Portal>
    );
};
