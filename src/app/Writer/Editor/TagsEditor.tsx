import { Component, Match, Show, Switch, useContext } from 'solid-js';
import { BaseBlock, TextBlock } from '../interface';
import { TagsRow } from '../../main/UserSelected';
import { atom, reflect, useEffectWithoutFirst } from '@cn-ui/use';
import { TagsToString, stringToTags } from '../../../use/TagsConvertor';
import { useTranslation } from '../../../i18n';
import { EditorTemplate } from './EditorTemplate';
import { Footer } from './Tags/Footer';
import { TagsSearch } from './Tags/TagsSearch';
import { SideBar } from './Tags/SideBar';
import type { GlobalGPT } from '../../../api/prompt-gpt';
import { AIPlace } from './Common/AIPlace';
import { WriterContext } from '../WriterContext';

export const TagsEditor: Component<{ block: BaseBlock }> = (props) => {
    const userCollection = atom(stringToTags(props.block.content.text));
    const inputMode = atom(true);
    const model = atom<keyof typeof GlobalGPT>('textToText', { equals: false });
    /** 原始的文本状态 */
    const text = reflect(() => TagsToString(userCollection()));
    useEffectWithoutFirst(() => (props.block.content.text = text()), [text]); // 需要不断将文本状态写入静态中

    const showAIPanel = atom(false);
    useEffectWithoutFirst(() => showAIPanel(true), [model]);

    const { transform } = useContext(WriterContext)!;
    return (
        <EditorTemplate
            sideBar={<SideBar model={model} block={props.block}></SideBar>}
            footer={<Footer userCollection={userCollection} inputMode={inputMode}></Footer>}
            tool={
                <>
                    <Show when={inputMode()}>
                        <TagsSearch userCollection={userCollection}></TagsSearch>
                    </Show>
                    <Show when={showAIPanel()}>
                        <AIPlace
                            block={props.block}
                            method={model}
                            input={text}
                            onClose={() => showAIPanel(false)}
                            onConfirm={(ai) => {
                                const newBlock = props.block.transTo(TextBlock);
                                newBlock.content.text = ai;
                                transform(props.block, newBlock);
                            }}
                        ></AIPlace>
                    </Show>
                </>
            }
        >
            <TagsRow usersCollection={userCollection}></TagsRow>
        </EditorTemplate>
    );
};
