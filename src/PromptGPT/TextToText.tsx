import { asyncLock, atom, resource } from '@cn-ui/use';
import { useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { AC } from '../components/AC';
import { GlobalGPT } from '../api/prompt-gpt';
import { Select } from './Select';
import copy from 'copy-to-clipboard';

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

export const TextToText = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom('');
    const lengthOfText = atom(30);
    const AIOutput = atom('');
    const useOutputTagMode = atom(false);
    const useInputTagMode = atom(false);
    const data = resource(
        () => {
            const model = useInputTagMode()
                ? GlobalGPT.TagsToText
                : GlobalGPT[useOutputTagMode() ? 'textToTags' : 'textToText'];
            return model.bind(GlobalGPT)(preInput(), lengthOfText(), (text) => AIOutput(text));
        },
        {
            immediately: false,
        }
    );

    const { t } = useTranslation();
    return (
        <section class="flex flex-1 select-text flex-col gap-1 overflow-hidden p-2">
            <div class="flex ">
                <Select each={Presets.description} onChange={(text) => preInput(text)}></Select>
                <textarea
                    class="w-full flex-1  rounded-lg bg-slate-800  px-4 text-sm outline-none"
                    placeholder="输入你想画的东西,不用太长，可以中文😄"
                    cols="2"
                    value={preInput()}
                    onchange={(e) => preInput((e.target as any).value)}
                />
            </div>
            <nav class="grid grid-cols-2 justify-items-center  gap-2 text-center text-xs">
                <button
                    onClick={() => {
                        preInput(TagsToString(usersCollection()).replace(/\n/g, ''));
                    }}
                    title="导入编辑区的文本"
                    class="my-2 w-full flex-1 cursor-pointer rounded-md p-1 transition-colors hover:bg-slate-700"
                >
                    导入魔咒
                </button>
                <button
                    title="拼接文本到你的编辑区"
                    class="my-2 w-full flex-1 cursor-pointer rounded-md p-1 transition-colors hover:bg-slate-700"
                    onClick={() => {
                        usersCollection((i) => i.concat(stringToTags(AIOutput(), lists())));
                        Notice.success(t('publicPanel.hint.CopySuccess'));
                    }}
                >
                    {t('publicPanel.CopyMagic')}
                </button>

                <label
                    class="inline-flex items-center justify-between"
                    title="如果你的输入是 Tags，那么可以将 Tags 转化为文本"
                >
                    <input
                        type="checkbox"
                        oninput={(e) => {
                            useInputTagMode((e.target as HTMLInputElement).checked);
                        }}
                    />
                    <span>输入是 Tags</span>
                </label>
                <label
                    class="inline-flex items-center justify-between"
                    title="如果输出为文本，那么将会切割为 Tags"
                >
                    <input
                        type="checkbox"
                        oninput={(e) => {
                            useOutputTagMode((e.target as HTMLInputElement).checked);
                        }}
                    />
                    <span>生成 Tag 格式</span>
                </label>

                <label class="inline-flex  items-center" title="生成长度，不一定符合要求">
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
                <div
                    onClick={() => {
                        copy(AIOutput());
                        Notice.success('复制成功');
                    }}
                >
                    📝
                </div>
            </nav>

            <article class="h-full flex-1 overflow-scroll">
                <p class="whitespace-pre-wrap p-4 text-sm">{AIOutput()}</p>
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
    );
};
