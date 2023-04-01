import { reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import type { AIImageInfo } from 'prompt-extractor';
import { Accessor, Component, For, Show, createMemo } from 'solid-js';

export const AIImageInfoShower: Component<{
    data: Accessor<AIImageInfo | null>;
}> = (props) => {
    const details = createMemo(() => props.data()!);
    const Comment = reflect(() => {
        return Object.assign({}, details()?.Comment);
    });
    return (
        <>
            {details().Software && (
                <nav class="flex justify-between  bg-emerald-700 px-2">
                    软件：{details().Software}
                </nav>
            )}
            <nav class="flex flex-col  bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between  bg-emerald-800  px-2">
                    <span>正面魔咒</span>
                    <div
                        class="font-icon  cursor-pointer hover:scale-125"
                        onclick={() => copy(details().Description)}
                    >
                        📄
                    </div>
                </nav>
                <code class="select-all" onclick={() => copy(details().Description)}>
                    {details().Description}
                </code>
            </nav>
            <div class="flex flex-col  bg-emerald-700 p-2">
                <nav class="my-1 flex justify-between  bg-emerald-800 px-2">
                    <span>负面魔咒</span>
                    <div
                        class="font-icon  cursor-pointer hover:scale-125"
                        onclick={() => copy(Comment().uc)}
                    >
                        📄
                    </div>
                </nav>
                <code class="select-all" onclick={() => copy(Comment().uc)}>
                    {Comment().uc ?? '未知'}
                </code>
            </div>

            <nav class="flex flex-col justify-between gap-2  bg-emerald-700 px-2">
                <header class="my-1 flex justify-between  bg-emerald-800 px-2 text-center">
                    参数
                </header>

                <For each={Object.entries(Comment())}>
                    {([key, value]) => {
                        if (key === 'uc') return null;
                        return (
                            <div class="flex flex-wrap justify-between gap-2">
                                <span>{key}： </span>
                                <span class="select-all">{value as string}</span>
                            </div>
                        );
                    }}
                </For>
            </nav>
            <Show when={details().others}>
                <nav class="flex flex-col  divide-y divide-slate-400  bg-emerald-700 px-2">
                    <header class="my-1  flex w-full justify-between  bg-emerald-800 px-2 text-center">
                        其他参数
                    </header>
                    <For each={Object.entries(details().others ?? {})}>
                        {([key, value]) => {
                            const tooLong = value.length > 40;
                            return (
                                <nav
                                    class="flex w-full flex-wrap justify-between py-2"
                                    classList={{ 'flex-col': tooLong }}
                                >
                                    <div class=" bg-emerald-800 px-2 text-white">{key}</div>
                                    <div class="select-all" classList={{ 'text-sm': tooLong }}>
                                        {value as string}
                                    </div>
                                </nav>
                            );
                        }}
                    </For>
                </nav>
            </Show>
        </>
    );
};
