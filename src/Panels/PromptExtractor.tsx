import { atom, createIgnoreFirst, resource } from '@cn-ui/use';

import { Panel } from '../components/Panel';
import { AIImageInfo, PromptExtractor } from 'prompt-extractor';
import { createAC } from '@cn-ui/headless';
import { Component, Show, createEffect, on } from 'solid-js';

export const PromptExtractorPanel = () => {
    const file = atom<File>(null);
    const data = resource<AIImageInfo | null>(async () => {
        if (file()) return null;
        const info = await file().arrayBuffer();
        return PromptExtractor(info);
    });
    createEffect(
        on(file, () => {
            data.refetch();
        })
    );
    let inputRef: HTMLInputElement;
    return (
        <Panel id="prompt-extractor">
            <div class="py-2 text-center text-lg text-white">法术解析</div>
            <div class="flex-1 select-text overflow-hidden p-2">
                <div
                    class="flex h-64  w-full select-none items-center justify-center rounded-lg outline-dashed outline-4 outline-slate-400 hover:bg-slate-700"
                    onclick={() => inputRef.click()}
                >
                    <div class="font-icon h-fit w-fit" style={{ 'font-size': '120px' }}>
                        add
                    </div>
                </div>
                <input
                    ref={inputRef}
                    class="hidden"
                    type="file"
                    accept="image/*"
                    oninput={(e) => file((e.target as HTMLInputElement).files[0])}
                />
            </div>
            <nav>
                <Show when={data()}>
                    <AIImageShower data={data()}></AIImageShower>
                </Show>
            </nav>
        </Panel>
    );
};
export const AIImageShower: Component<{ data: AIImageInfo }> = (props) => {
    return <div></div>;
};
