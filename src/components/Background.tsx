import { Component } from 'solid-js';

export const Background: Component<{ image?: string }> = (props) => {
    return (
        <div class="brightness-40 pointer-events-none fixed h-full w-full opacity-30">
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
    );
};
