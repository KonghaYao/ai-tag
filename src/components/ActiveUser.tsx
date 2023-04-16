import { resource } from '@cn-ui/reactive';
import { Show } from 'solid-js';

export const ActiveUser = () => {
    const active = resource(() =>
        fetch('https://tag-server.deno.dev/site/active').then((res) => res.json())
    );
    return (
        <Show when={active.isReady()}>
            <div class="flex gap-1">
                <span class="h-2 w-2 bg-green-500"></span>
                <span>{active()} 人</span>
            </div>
        </Show>
    );
};
