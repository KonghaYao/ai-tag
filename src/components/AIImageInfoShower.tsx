import { reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { AIImageInfo } from 'prompt-extractor';
import { Component, For, Show } from 'solid-js';

export const AIImageInfoShower: Component<{
    data: () => AIImageInfo;
}> = (props) => {
    const details = props.data;
    const Comment = reflect(() => {
        return Object.assign({}, details()?.Comment);
    });
    return (
        <>
            {details().Software && (
                <nav class="flex justify-between rounded-lg bg-emerald-700 px-2">
                    软件：{details().Software}
                </nav>
            )}
            <nav class="flex flex-col rounded-lg bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between rounded-lg bg-emerald-800  px-2">
                    <span>正面魔咒</span>
                    <div
                        class="font-icon  cursor-pointer hover:scale-125"
                        onclick={() => copy(details().Description)}
                    >
                        copy
                    </div>
                </nav>
                <code class="select-all" onclick={() => copy(details().Description)}>
                    {details().Description}
                </code>
            </nav>
            <div class="flex flex-col rounded-lg bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between rounded-lg bg-emerald-800 px-2">
                    <span>负面魔咒</span>
                    <div
                        class="font-icon  cursor-pointer hover:scale-125"
                        onclick={() => copy(Comment().uc)}
                    >
                        copy
                    </div>
                </nav>
                <code class="select-all" onclick={() => copy(Comment().uc)}>
                    {Comment().uc ?? '未知'}
                </code>
            </div>

            <nav class="flex flex-col justify-between gap-2 rounded-lg bg-emerald-700 px-2">
                <header class="my-1 flex justify-between rounded-lg bg-emerald-800 px-2 text-center">
                    参数
                </header>

                <For each={Object.entries(Comment())}>
                    {([key, value]) => {
                        if (key === 'uc') return null;
                        return (
                            <div class="flex justify-between gap-2">
                                <span>{key}： </span>
                                <span class="select-all">{value as string}</span>
                            </div>
                        );
                    }}
                </For>
            </nav>
            <Show when={details().others}>
                <nav class="grid grid-cols-2 justify-between gap-2 rounded-lg bg-emerald-700 px-2">
                    <header class="col-span-2 my-1 flex justify-between rounded-lg bg-emerald-800 px-2 text-center">
                        其他参数
                    </header>
                    <For each={Object.entries(details().others)}>
                        {([key, value]) => {
                            return (
                                <>
                                    <div>{key}： </div>
                                    <div class="select-all">{value as string}</div>
                                </>
                            );
                        }}
                    </For>
                </nav>
            </Show>
        </>
    );
};
