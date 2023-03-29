import { Component, Show } from 'solid-js';
import type { BaseBlock } from '../interface';
import { TagsRow } from '../../main/UserSelected';
import { atom } from '@cn-ui/use';
import { stringToTags } from '../../../use/TagsConvertor';
import { useTranslation } from '../../../i18n';
import { EditorTemplate } from './EditorTemplate';
import { Footer } from './Tags/Footer';
import { TagsSearch } from './Tags/TagsSearch';
import { SideBar } from './Tags/SideBar';

export const TagsEditor: Component<{ block: BaseBlock }> = (props) => {
    const userCollection = atom(stringToTags(props.block.content.text));
    const inputMode = atom(true);
    return (
        <EditorTemplate
            sideBar={<SideBar block={props.block}></SideBar>}
            footer={<Footer userCollection={userCollection} inputMode={inputMode}></Footer>}
            tool={
                <Show when={inputMode()}>
                    <TagsSearch userCollection={userCollection}></TagsSearch>
                </Show>
            }
        >
            <TagsRow usersCollection={userCollection}></TagsRow>
        </EditorTemplate>
    );
};
