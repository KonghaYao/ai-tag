import { Component, Match, Show, Switch } from 'solid-js';
import type { BaseBlock } from '../interface';
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

export const TagsEditor: Component<{ block: BaseBlock }> = (props) => {
    const userCollection = atom(stringToTags(props.block.content.text));
    const inputMode = atom(true);
    const model = atom<keyof typeof GlobalGPT>('textToText', { equals: false });
    const showAIPanel = atom(false);
    const text = reflect(() => TagsToString(userCollection()));
    useEffectWithoutFirst(() => showAIPanel(true), [model]);
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
                                //TODO 转换
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
