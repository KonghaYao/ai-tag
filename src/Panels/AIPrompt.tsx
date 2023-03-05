import { atom, resource } from '@cn-ui/use';
import { Show, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { useAIWritePrompt } from '../api/huggingface';

export const AIPrompt = () => {
    const { usersCollection, lists } = useContext(Data);
    const preInput = atom(TagsToString(usersCollection()));
    const data = resource(() => useAIWritePrompt(preInput()));

    const { t } = useTranslation();
    return (
        <Panel id="ai-prompt">
            <header class="py-2 text-center text-lg text-white">AI 写作助手</header>
            <section class="flex-1 select-text overflow-hidden p-2">
                <div class="text-sm text-red-300">研发测试中，PowerBy HuggingFace 🤗</div>

                <input
                    class=" w-full rounded-lg bg-slate-700 px-4 outline-none"
                    type="text"
                    placeholder="逗号分割的关键词，例如 1 girl"
                    value={preInput()}
                    onChange={(e) => {
                        preInput((e.target as any).value);
                    }}
                />
            </section>
            <div class="flex justify-between ">
                <button
                    class="btn"
                    onClick={() => {
                        usersCollection(stringToTags(data().generated_text, lists()));
                        Notice.success(t('publicPanel.hint.CopySuccess'));
                    }}
                >
                    {t('publicPanel.CopyMagic')}
                </button>
            </div>
        </Panel>
    );
};
