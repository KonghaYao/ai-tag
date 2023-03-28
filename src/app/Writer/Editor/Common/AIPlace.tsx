import { Atom, asyncLock, atom, reflect, resource } from '@cn-ui/use';
import { GlobalGPT } from '../../../../api/prompt-gpt';
import { AC } from '../../../../components/AC';
import { InputOpenAIToken } from '../../../../Panels/PromptGPT/PromptGPT';
import { Notice } from '../../../../utils/notice';
import copy from 'copy-to-clipboard';

export const ProModelName = {
    ContinueWriting: '续写',
    AskAnything: '提问',
};
export const BaseModelName = { textToTags: '文生词', TagsToText: '词生文', textToText: '文生文' };

export const AllModelName = { ...BaseModelName, ...ProModelName };

export const CNModelName = { ...BaseModelName, ...ProModelName } as {
    [A in keyof typeof GlobalGPT]: string;
};

export const AIPlace = (props: {
    input: Atom<string>;
    onConfirm: (text: string) => void;
    onClose: () => void;
    method: Atom<keyof typeof GlobalGPT>;
}) => {
    const method = props.method;
    const modelName = reflect(() => CNModelName[method()]);
    const AIOutput = atom('');
    const length = atom(30);
    const data = resource(
        () => {
            return (GlobalGPT[method()] as any)(props.input(), length(), (text: string) => {
                AIOutput(text);
            });
        }
        // 一打开就开始写
        // { immediately: false }
    );
    return (
        <article class="h-full flex-1 overflow-scroll border-t border-solid border-slate-400 pt-2">
            <div>
                ✨ <span class="px-2">{modelName()}</span>
                GPT for You
                <label
                    class="float-right inline-flex items-center"
                    title="生成长度，不一定符合要求"
                >
                    <div class="flex-none">长度 {length()}</div>
                    <input
                        class=" px-2"
                        type="range"
                        min="20"
                        max="50"
                        step="1"
                        value={length()}
                        oninput={(e) => {
                            length(parseInt((e.target as any).value));
                        }}
                    />
                </label>
            </div>
            <p class="select-text whitespace-pre-wrap p-4 text-sm">{AIOutput()}</p>
            <AC
                resource={data}
                loading={() => <div class="text-orange-600">AI 正在生成中。。。</div>}
                error={(e) => {
                    console.error(e.error());
                    return (
                        <div class="text-sm text-rose-600">
                            发生错误了😂
                            <br />
                            <span class="text-sm text-rose-700">{e.error().message}</span>
                        </div>
                    );
                }}
            ></AC>
            <ul class="flex w-full cursor-pointer justify-end gap-2 text-lg">
                <InputOpenAIToken class="flex-1 text-xs">
                    {GlobalGPT.ownKey ? '使用 Token 中' : '添加 Token 可以添加更多功能'}
                </InputOpenAIToken>
                <li
                    title="复制文本"
                    onclick={() => {
                        copy(AIOutput());
                        Notice.success('复制成功');
                    }}
                >
                    📄
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
