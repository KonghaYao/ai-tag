import { Atom, asyncLock, atom, atomization, reflect, resource } from '@cn-ui/use';
import { GlobalGPT } from '../../../../api/prompt-gpt';
import { AC } from '../../../../components/AC';
import { InputOpenAIToken } from '../../../../Panels/PromptGPT/PromptGPT';
import { Notice } from '../../../../utils/notice';
import copy from 'copy-to-clipboard';
import { CNModelName } from '../../../../api/prompt-gpt/CNModelName';
import { For } from 'solid-js';
import type { BaseBlock } from '../../interface';

export const AIPlace = (props: {
    block: BaseBlock;
    input: Atom<string>;
    onConfirm: (text: string) => void;
    onClose: () => void;
    method: Atom<keyof typeof GlobalGPT>;
    lazy?: boolean;
    AIOutput?: Atom<string>;
}) => {
    const method = props.method;
    const AIOutput = atomization(props.AIOutput ?? '');
    const length = atom(30);
    const data = resource(
        () => {
            return (GlobalGPT[method()] as any)(props.input(), length(), (text: string) => {
                AIOutput(text);
            });
        },
        // 一打开就开始写
        { immediately: !props.lazy, initValue: '' }
    );
    return (
        <article class="h-full flex-1 overflow-scroll border-t border-solid border-slate-400 pt-2">
            <header class="flex items-center">
                <span>✨</span>
                <select
                    class="mx-2 bg-slate-800 outline-none"
                    value={method()}
                    onchange={(e) => {
                        method(() => (e.target as any).value);
                        data.refetch();
                    }}
                >
                    <For
                        each={props.block.supportAI.map((i) => {
                            return [CNModelName[i], i];
                        })}
                    >
                        {([key, value]) => {
                            return <option value={value}>{key}</option>;
                        }}
                    </For>
                </select>
                <div class="flex-1"></div>
                <label
                    class="float-right inline-flex items-center text-xs"
                    title="生成长度，不一定符合要求"
                >
                    <div class="flex-none">长度 {length()}</div>
                    <input
                        class=" px-2"
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={length()}
                        oninput={(e) => {
                            length(parseInt((e.target as any).value));
                        }}
                    />
                </label>
            </header>
            <p class="select-text whitespace-pre-wrap p-4 text-sm">{AIOutput()}</p>
            <AC
                resource={data}
                loading={() => <div class="text-orange-600">AI 正在生成中。。。</div>}
                error={(e) => {
                    console.error(e.error());
                    return (
                        <div class="text-sm text-rose-600">发生错误了😂:{e.error().message}</div>
                    );
                }}
            ></AC>
            <ul class="flex w-full cursor-pointer justify-end gap-2 text-lg">
                <InputOpenAIToken class="flex-1 text-xs">
                    {GlobalGPT.ownKey ? '使用 Token 中' : '添加 Token '}
                </InputOpenAIToken>
                <li
                    title="复制文本"
                    onclick={() => {
                        copy(AIOutput());
                        Notice.success('复制成功');
                    }}
                >
                    📋
                </li>

                <li title="重新生成" onclick={asyncLock(() => data.refetch())}>
                    🔃
                </li>
                <li
                    title="采纳 AI"
                    onclick={() => {
                        props.onConfirm && props.onConfirm(AIOutput());
                        props.onClose && props.onClose();
                    }}
                >
                    ✅
                </li>
                <li title="否定 AI" onclick={() => props.onClose && props.onClose()}>
                    ❎
                </li>
            </ul>
        </article>
    );
};
