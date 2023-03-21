import { asyncLock, atom, resource } from '@cn-ui/use';
import { Component, For, Show, batch, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { AC } from '../components/AC';
import { GlobalGPT } from '../api/prompt-gpt';
import { Tab, Tabs } from '@cn-ui/core';

export const Select: Component<{
    each: { name?: string; value: string }[];
    onChange: (text: string) => void;
}> = (props) => {
    return (
        <select
            title="默认预设"
            class=" w-5 bg-slate-600 outline-none"
            onchange={(e) => {
                props.onChange((e.target as any).value);
            }}
            value=""
        >
            <For each={props.each}>
                {(item) => {
                    return <option value={item.value}>{item.name ?? item.value}</option>;
                }}
            </For>
        </select>
    );
};

const Presets = {
    description: [
        {
            value: '日本 JK 萝莉',
        },
        {
            value: '超短裙女孩在绑单马尾',
        },
        {
            value: '人形机器美少女，脸部很自然',
        },
        {
            value: '少女百合日常',
        },
        {
            value: '两个女生一起逛街的人物画像',
        },
        {
            value: '沙滩上的泳装少女',
        },
        {
            value: '赛博朋克的黑暗都市',
        },
        {
            value: '对远山与小屋的专业摄影',
        },
        {
            value: '浪花般的樱花的风景图',
        },
        {
            value: '太空大战',
        },
        {
            value: '精致的少女穿着黑丝和白衬衫',
        },
        {
            value: '穿着传统巫女服的少女',
        },
        {
            value: '英伦动画风格的少女',
        },
        { value: '双马尾水手服女高中生穿着黑丝和短裙' },
        { value: '女生穿着复杂和服' },
    ],
};

export const PromptGPT = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom('');
    const lengthOfText = atom(30);
    const AIOutput = atom('');
    const useTagMode = atom(false);
    const data = resource(
        () => {
            const model = GlobalGPT[useTagMode() ? 'textToTags' : 'textToText'].bind(GlobalGPT);
            return model(preInput(), lengthOfText(), (text) => AIOutput(text));
        },
        {
            immediately: false,
        }
    );

    const { t } = useTranslation();
    return (
        <Panel id="ai-prompt">
            <header class="py-2 text-center text-lg text-white">AI 魔咒助手</header>

            <section class="flex flex-1 select-text flex-col gap-1 overflow-hidden p-2">
                <label>
                    <div class="my-4 text-lg ">
                        输入你想画的东西
                        <span
                            class="float-right"
                            onclick={() => {
                                const token = prompt(
                                    '输入 OpenAI 的 token。我们不会保存你的 token，完全在你的设备上使用它, 空白为删除你的 token。',
                                    GlobalGPT.ownKey
                                );
                                if (token) {
                                    GlobalGPT.ownKey = token;
                                } else {
                                    GlobalGPT.ownKey = '';
                                }
                            }}
                        >
                            🔑
                        </span>
                    </div>
                    <div class="flex ">
                        <Select
                            each={Presets.description}
                            onChange={(text) => preInput(text)}
                        ></Select>
                        <textarea
                            class="w-full flex-1  rounded-lg bg-slate-800 p-2 px-4 text-sm outline-none"
                            placeholder="输入你想画的东西,不用太长，可以中文😄"
                            cols="2"
                            value={preInput()}
                            onchange={(e) => preInput((e.target as any).value)}
                        />
                    </div>
                </label>
                <nav class="grid grid-cols-2 justify-items-center  gap-2 text-center text-xs">
                    <button
                        onClick={() => {
                            preInput(TagsToString(usersCollection()).replace(/\n/g, ''));
                        }}
                        class="my-2 flex-1 cursor-pointer rounded-md p-1  transition-colors hover:bg-slate-700"
                    >
                        导入魔咒
                    </button>
                    <label class="inline-flex items-center justify-between">
                        <input
                            type="checkbox"
                            oninput={(e) => {
                                useTagMode((e.target as HTMLInputElement).checked);
                            }}
                        />
                        <span>采用 Tag 格式</span>
                    </label>

                    <label class="inline-flex  items-center" title="生成长度">
                        <div class="flex-none">长度 {lengthOfText()}</div>
                        <input
                            class=" px-2"
                            type="range"
                            min="20"
                            max="50"
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
                        开始生成 Prompt
                    </button>
                </nav>

                <article class="overflow-scroll">
                    <p class="text-sm">{AIOutput()}</p>
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
                </article>
            </section>
            <div class="flex justify-between ">
                <button
                    class="btn"
                    onClick={() => {
                        usersCollection(stringToTags(AIOutput(), lists()));
                        Notice.success(t('publicPanel.hint.CopySuccess'));
                    }}
                >
                    {t('publicPanel.CopyMagic')}
                </button>
            </div>
        </Panel>
    );
};
