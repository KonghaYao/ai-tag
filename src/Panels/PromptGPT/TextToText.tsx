import { atom } from '@cn-ui/use';
import { useTranslation } from '../../i18n';
import { TagsToString, stringToTags } from '../../use/TagsConvertor';
import { Notice } from '../../utils/notice';
import type { GlobalGPT } from '../../api/prompt-gpt';
import { Select } from './Select';
import { GlobalData } from '../../store/GlobalData';
import { AIPlace } from '../../app/Writer/Editor/Common/AIPlace';
import { BaseBlock } from '../../app/Writer/interface';
import { CNModelName } from '../../api/prompt-gpt/CNModelName';

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
        { value: '使用绚丽的魔法的女巫' },
        { value: '魔法少女和她的魔法' },
        { value: '蓝色的猫娘' },
        { value: '狼样貌的帅气 furry' },
        { value: '冬天里捧着热水的女孩' },
        { value: '握着头发的女生脸部特写' },
        { value: '从上方看东西杂乱的宿舍里坐着的女孩' },
        { value: '杂乱的房间里，光着腿坐在窗边的少女' },
        { value: '婚礼上捧着花朵的女孩' },
        { value: '秋天银杏树下的一个女孩' },
        { value: '在上学路上穿着白丝和高中校服的女生' },
        { value: '穿白色 pantyhose 的美少女' },
        { value: '具有朦胧感的穿着透明轻纱的幸福舞娘' },
        {
            value: '浪花般的樱花的风景图',
        },
        {
            value: '太空大战',
        },
        {
            value: '精致的少女穿着黑丝和白衬衫',
        },
        { value: '双马尾水手服女高中生穿着黑丝和短裙' },
        { value: '女生穿着复杂和服' },
    ],
};

export const TextToText = () => {
    const { usersCollection, lists } = GlobalData.getApp('tag-control');
    const preInput = atom('');
    const AIOutput = atom('👑输入描述词，点击🔃按钮可生成！');
    const { t } = useTranslation();
    const block = new BaseBlock();
    block.supportAI = Object.keys(CNModelName) as any[];
    return (
        <section class="flex flex-1 select-text flex-col gap-1 overflow-hidden p-2">
            <div class="my-2 flex overflow-hidden rounded-md">
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
            </nav>

            <article class="h-full flex-1 overflow-scroll">
                <AIPlace
                    block={block}
                    input={preInput}
                    onClose={() => {}}
                    onConfirm={() => {}}
                    method={atom<keyof typeof GlobalGPT>('textToTags')}
                    AIOutput={AIOutput}
                    lazy
                ></AIPlace>
            </article>
        </section>
    );
};
