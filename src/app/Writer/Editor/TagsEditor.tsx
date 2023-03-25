import type { Component } from 'solid-js';
import type { Block } from '../App';
import { TagsRow } from '../../main/UserSelected';
import { atom } from '@cn-ui/use';
import { stringToTags } from '../../../use/TagsConvertor';
import { GlobalData } from '../../../store/GlobalData';
import { FullTextEditor } from './TextEditor';

export const TagsEditor: Component<{ block: Block }> = (props) => {
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    const userCollection = atom(stringToTags(props.block.content.text));
    const text = atom('');
    return (
        <div class="flex items-center gap-2 bg-slate-900 px-2">
            <ul class="flex flex-col items-center gap-1">
                <li
                    class="cursor-pointer"
                    classList={{
                        'bg-slate-600': emphasizeAddMode(),
                    }}
                    title="添加模式，左键加权，右键减权"
                    onClick={() => changeTagMode(emphasizeAddMode, true)}
                >
                    🏷️
                </li>
                <li
                    class="cursor-pointer"
                    classList={{
                        'bg-slate-600': deleteMode(),
                    }}
                    title="删除模式，点击删除"
                    onClick={() => changeTagMode(deleteMode, true)}
                >
                    ❌
                </li>
            </ul>

            <div class="flex-1">
                <TagsRow usersCollection={userCollection}></TagsRow>
                <aside class="mb-2 rounded-md bg-slate-800 p-1">
                    <FullTextEditor
                        placeholder="在这里输入 Tags; Ctrl+Enter 添加"
                        text={text}
                    ></FullTextEditor>
                </aside>
            </div>
        </div>
    );
};
