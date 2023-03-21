import { asyncLock, atom, resource } from '@cn-ui/use';
import { Show, batch, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { AC } from '../components/AC';
import { sampleSize } from 'lodash-es';

/** 逗号空格分割字词，然后进行百分比取样，这样可以缩短句子 */
const cutTheString = (input: string, sampleRate: number = 50, borderRange = 20) => {
    const after = input.split(/\s|,/g).slice(input.length - borderRange);
    return after.slice(Math.ceil(sampleRate / 100));
};
/**
 * @deprecated 因为 Chat GPT 太好用了，所以直接放弃了自己训练的计划😂
 * @returns
 */
export const AIPrompt = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom('');
    const sampleRate = atom(50);
    const lengthOfText = atom(70);
    const data = resource(
        () => {
            const input = preInput().trim();
            // console.log(input);
            /**  */
            let sampledText =
                (input.length >= 100
                    ? cutTheString(input, sampleRate()).join(',')
                    : input
                ).replaceAll('\n', '') || ',';
            console.log(sampledText);
            return fetch(
                `https://magic-prompts.deno.dev?length=${lengthOfText()}&text=` + sampledText
            )
                .then((res) => res.json())
                .then((res: { error?: string; text: string; time: number }) => {
                    if (res.text) {
                        // 处理返回的数据，不需要断行和头部的提示词，头部替后面会换回去
                        res.text = res.text.replace(sampledText, '');
                        // console.log([res.text, sampledText]);
                        //! 断行会严重影响 ai 生成，所以删除
                        // res.text = res.text.replaceAll('\n', '');

                        console.log(res.text, sampledText);
                        return res;
                    } else {
                        throw new Error(res.error);
                    }
                });
        },
        {
            initValue: { text: '', time: 0 },
            immediately: false,
        }
    );

    const { t } = useTranslation();
    return (
        <Panel id="ai-prompt">
            <header class="py-2 text-center text-lg text-white">AI 魔咒助手</header>
            <section class="flex flex-1 select-text flex-col gap-1 overflow-hidden p-2">
                <div class="text-sm text-red-300">
                    <a href="https://huggingface.co/KonghaYao/MagicPrompt_SD_V1" target="_blank">
                        <span class="btn">PowerBy HuggingFace🤗</span>
                    </a>
                </div>

                <textarea
                    class=" h-[40%] w-full rounded-lg bg-slate-800 p-2 px-4 text-sm outline-none"
                    placeholder="一些较短的提示词, 不写也可以😄"
                    value={preInput()}
                    onchange={(e) => preInput((e.target as any).value)}
                />
                <nav class="grid grid-cols-2 gap-2 text-center text-xs">
                    <button
                        onClick={() => {
                            preInput(TagsToString(usersCollection()).replace(/\n/g, ''));
                        }}
                        class="my-2 flex-1 cursor-pointer rounded-md p-1  transition-colors hover:bg-slate-700"
                    >
                        导入魔咒
                    </button>
                    <div></div>
                    <label
                        class="inline-flex flex-col items-center"
                        title="采样率越低，生成长度越长；反之亦然。"
                    >
                        <span>采样率 {sampleRate()}</span>
                        <input
                            class=" px-2"
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={sampleRate()}
                            oninput={(e) => {
                                sampleRate(parseInt((e.target as any).value));
                            }}
                        />
                    </label>
                    <label class="inline-flex flex-col items-center" title="生成长度">
                        <span>长度 {lengthOfText()}</span>
                        <input
                            class=" px-2"
                            type="range"
                            min="50"
                            max="100"
                            step="1"
                            value={lengthOfText()}
                            oninput={(e) => {
                                lengthOfText(parseInt((e.target as any).value));
                            }}
                        />
                    </label>
                </nav>
                <nav class="flex gap-2">
                    <button class="btn flex-1 " onClick={asyncLock(() => data.refetch())}>
                        补写 Prompt
                    </button>
                    {data() && (
                        <button
                            class="btn flex-1 "
                            onClick={() => {
                                batch(() => {
                                    const text = data().text;

                                    preInput((i) => i + (text.endsWith(',') ? text : text + ','));
                                    data.mutate({ text: '', time: 0 });
                                });
                            }}
                        >
                            采用 AI
                        </button>
                    )}
                </nav>
                <nav class="text-sm text-green-600">用时{data().time} ms</nav>

                <article class="overflow-scroll">
                    <p class="">
                        <span class="text-sm">{preInput()}</span>

                        <AC
                            resource={data}
                            loading={() => <div class="text-orange-600">AI 正在生成中。。。</div>}
                            error={(e) => {
                                console.error(e.error());
                                return (
                                    <div class="text-sm text-rose-600">
                                        发生错误了😂
                                        <br />
                                        <span class="text-sm text-rose-700">
                                            {e.error().message}
                                        </span>
                                    </div>
                                );
                            }}
                        >
                            {data() && <span class="text-green-600 ">{data().text}</span>}
                        </AC>
                    </p>
                </article>
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
