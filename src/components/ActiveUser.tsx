import { resource } from '@cn-ui/reactive';

export const ActiveUser = () => {
    const active = resource(
        () =>
            fetch('https://tag-server.deno.dev/site/active')
                .then((res) => res.json())
                .then((res) => res[0].x),
        { initValue: 1 }
    );
    return (
        <div class="flex items-center justify-center gap-2">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            <span>{active()} 人在线</span>
        </div>
    );
};
