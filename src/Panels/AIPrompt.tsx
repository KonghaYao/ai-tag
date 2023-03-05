import { atom, resource } from '@cn-ui/use';
import { Show, batch, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { useAIWritePrompt } from '../api/huggingface';
import { AC } from '../components/AC';

const cutTheString = (input: string, partLength: number) => {
    const after = input.slice(input.length - partLength, input.length);
    const index = after.search(/\s|,/);
    const res = after.slice(index + 1);
    return res;
};
export const AIPrompt = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom('');

    const data = resource(
        () => {
            const input = preInput();

            const part = input.length >= 100 ? cutTheString(input, 50) : input;

            return useAIWritePrompt(part, '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').then((res) => {
                res.generated_text = res.generated_text.replaceAll('\n', '');
                const old = res.generated_text;
                res.generated_text = res.generated_text.replace(part, preInput());
                if (old === res.generated_text) {
                    res.generated_text = preInput() + old;
                }
                return res;
            });
        },
        {
            initValue: { generated_text: '', time: 0 },
            immediately: false,
        }
    );

    const { t } = useTranslation();
    return (
        <Panel id="ai-prompt">
            <header class="py-2 text-center text-lg text-white">AI 魔咒助手</header>
            <section class="flex flex-1 select-text flex-col gap-1 overflow-hidden p-2">
                <div class="text-sm text-red-300">研发测试中，PowerBy HuggingFace 🤗</div>

                <textarea
                    class=" h-[40%] w-full rounded-lg bg-slate-800 p-2 px-4 text-sm outline-none"
                    placeholder="一些较短的提示词"
                    value={preInput()}
                    onchange={(e) => preInput((e.target as any).value)}
                />
                <nav
                    onClick={() => {
                        preInput(TagsToString(usersCollection()).replace(/\n/g, ''));
                    }}
                    class="my-2 cursor-pointer rounded-md p-1 text-center text-xs transition-colors hover:bg-slate-700"
                >
                    使用您正在制作的 Prompt
                </nav>
                <nav class="flex gap-2">
                    <button class="btn flex-1 " onClick={() => data.refetch()}>
                        补写 Prompt
                    </button>
                    {data() && (
                        <button
                            class="btn flex-1 "
                            onClick={() => {
                                batch(() => {
                                    const text = data().generated_text;

                                    preInput(text.endsWith(',') ? text : text + ',');
                                    data.mutate({ generated_text: '', time: 0 });
                                });
                            }}
                        >
                            采用 AI
                        </button>
                    )}
                </nav>
                <AC
                    resource={data}
                    loading={() => <div>AI 正在生成中。。。</div>}
                    error={(e) => {
                        console.error(e.error());
                        return <div>报错了，应该是模型在加载中，但别怕等半分钟应该就可以用了</div>;
                    }}
                >
                    {data() && (
                        <>
                            <nav class="text-sm text-green-600">用时{data().time / 1000} ms</nav>
                            <article class="overflow-scroll">
                                <p class="">
                                    <span class="text-sm">{preInput()}</span>
                                    <span class="text-green-600 ">
                                        {data().generated_text.replace(preInput(), '')}
                                    </span>
                                </p>
                            </article>
                        </>
                    )}
                </AC>
            </section>
            <section class="flex "></section>
            <div class="flex justify-between ">
                <button
                    class="btn"
                    onClick={() => {
                        usersCollection(stringToTags(preInput(), lists()));
                        Notice.success(t('publicPanel.hint.CopySuccess'));
                    }}
                >
                    {t('publicPanel.CopyMagic')}
                </button>
            </div>
        </Panel>
    );
};
