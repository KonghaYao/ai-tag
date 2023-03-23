import { atom, resource } from '@cn-ui/use';

import { Panel } from '../components/Panel';
import { AIImageInfo, PromptExtractor } from 'prompt-extractor';
import { DropReceiver } from '@cn-ui/headless';
import { Show, createEffect, on } from 'solid-js';
import { AIImageInfoShower } from '../components/AIImageInfoShower';
import { untrack } from 'solid-js/web';
import { Message } from '../components/MessageHInt';
import { AC } from '../components/AC';

/** 图片解析面板 */
export const PromptExtractorPanel = () => {
    const file = atom<File | null>(null);
    const data = resource<AIImageInfo | null>(async () => {
        const f = file();
        if (f === null) return null;
        const info = await f.arrayBuffer();
        return PromptExtractor(info);
    });
    let last = atom('');
    createEffect(() => {
        untrack(last) && URL.revokeObjectURL(untrack(last));
        const f = file();
        f && last(URL.createObjectURL(f));
    });
    createEffect(
        on(file, () => {
            data.refetch();
        })
    );
    let inputRef!: HTMLInputElement;
    return (
        <Panel id="prompt-extractor">
            <div class="py-2 text-center text-lg text-white">法术解析</div>
            <div class="flex  flex-1 flex-col gap-4 overflow-hidden p-2">
                <nav class="flex flex-1 flex-col gap-2 overflow-scroll break-words p-1 text-white">
                    <div>支持对 SD、Novel AI、Paddle 的生成图片解析</div>
                    <DropReceiver
                        detect={{
                            extra(dataTransfer: DataTransfer) {
                                if (dataTransfer.types.includes('Files'))
                                    Message.success('松开，法术解析图片');
                            },
                        }}
                        receive={{
                            extra(_, dataTransfer: DataTransfer) {
                                const item = [...dataTransfer.files].find((i) => {
                                    return i.type.startsWith('image/');
                                });
                                item && file(() => item);
                            },
                        }}
                    >
                        <div
                            class="flex  w-full  flex-none select-none items-center justify-center rounded-lg outline-dashed outline-4 outline-slate-400 hover:bg-slate-700"
                            classList={{
                                'h-32': !last(),
                                'h-16': !!last(),
                            }}
                            onclick={() => inputRef.click()}
                        >
                            <div class="font-icon h-fit w-fit" style={{ 'font-size': '120px' }}>
                                add
                            </div>
                        </div>
                    </DropReceiver>
                    <input
                        ref={inputRef}
                        class="hidden"
                        type="file"
                        accept="image/*"
                        oninput={(e) => {
                            file(() => {
                                const f = (e.target as HTMLInputElement).files;
                                return f ? f[0] : f;
                            });
                        }}
                    />
                    <img src={last()} alt="" />
                    <AC resource={data}>
                        <Show when={data()}>
                            <AIImageInfoShower data={data}></AIImageInfoShower>
                        </Show>
                    </AC>
                </nav>
            </div>
        </Panel>
    );
};
