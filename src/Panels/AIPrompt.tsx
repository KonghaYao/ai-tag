import { atom, resource } from '@cn-ui/use';
import { Show, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { stringToTags } from '../use/TagsConvertor';
import { CombineMagic } from '../utils/CombineMagic';
import { Notice } from '../utils/notice';

export const AIPrompt = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom('');
    const length = atom(60);
    const data = resource<{ prompt: string }>(() =>
        fetch(
            `https://bundle-konghayao.cloud.okteto.net/api/getMagic?input=${preInput()}&length=${length()}`
        ).then((res) => res.json())
    );

    const { t } = useTranslation();
    return (
        <Panel id="ai-prompt">
            <div class="py-2 text-center text-lg text-white">黑魔法词生词</div>
            <div class="flex-1 select-text overflow-hidden p-2">
                <div class="text-sm text-red-300">研发测试中，PowerBy KonghaYao</div>
                <div class="text-sm text-yellow-300">随机黑魔咒为 AI 随机生成</div>
                <div class="text-sm text-yellow-300">且训练集较多为 r18 内容</div>
                <button class="btn my-2 w-full" onclick={() => data.refetch()}>
                    刷新
                </button>
                <input
                    class=" w-full rounded-lg bg-slate-700 px-4 outline-none"
                    type="text"
                    placeholder="逗号分割的关键词，例如 1 girl"
                    value={preInput()}
                    onChange={(e) => {
                        preInput((e.target as any).value);
                    }}
                />
                <div class="flex justify-between py-2">
                    <div>长度: {length()}</div>
                    <input
                        type="range"
                        min={10}
                        max={100}
                        step={1}
                        value={length()}
                        onChange={(e) => {
                            length(parseInt((e.target as any).value));
                        }}
                    />
                </div>

                <div class="text-yellow-300">你的随机黑魔咒</div>
                <Show when={data.isReady()} fallback={'加载中'}>
                    <p class="max-h-96 overflow-y-auto overflow-x-hidden">{data().prompt}</p>
                </Show>
            </div>
            <div class="flex justify-between ">
                <button
                    class="btn"
                    onClick={() => {
                        usersCollection(stringToTags(data().prompt, lists()));
                        Notice.success(t('publicPanel.hint.CopySuccess'));
                    }}
                >
                    {t('publicPanel.CopyMagic')}
                </button>
                <button
                    class="btn"
                    onClick={() => {
                        const input = stringToTags(data().prompt, lists());
                        CombineMagic(input, usersCollection);
                        Notice.success(t('publicPanel.hint.CombineSuccess'));
                    }}
                >
                    融合魔法
                </button>
            </div>
        </Panel>
    );
};
