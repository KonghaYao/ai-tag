import { Component, Show, batch } from 'solid-js';
import type { Block } from '../App';
import { TagsRow } from '../../main/UserSelected';
import { atom } from '@cn-ui/use';
import { stringToTags } from '../../../use/TagsConvertor';
import { GlobalData } from '../../../store/GlobalData';
import { ContentEditable } from '../../../components/ContentEditable';

export const TagsEditor: Component<{ block: Block }> = (props) => {
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    const userCollection = atom(stringToTags(props.block.content.text));
    const text = atom('');
    const inputMode = atom(false);
    return (
        <div class="flex items-center gap-2  rounded-xl border border-solid border-slate-600 p-2">
            <ul class="flex flex-col items-center gap-1">
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': emphasizeAddMode(),
                    }}
                    title="添加模式，左键加权，右键减权"
                    onClick={() => changeTagMode(emphasizeAddMode, true)}
                >
                    🏷️
                </li>
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': deleteMode(),
                    }}
                    title="删除模式，点击删除"
                    onClick={() => changeTagMode(deleteMode, true)}
                >
                    ❌
                </li>
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': inputMode(),
                    }}
                    title="删除模式，点击删除"
                    onClick={() => inputMode((i) => !i)}
                >
                    ✒️
                </li>
            </ul>

            <div class="flex-1 transition-all">
                <TagsRow usersCollection={userCollection}></TagsRow>
                <Show when={inputMode()}>
                    <aside class="mx-2 flex items-center gap-2 rounded-md  border  border-solid border-slate-600 bg-slate-800 px-2">
                        <div>✒️</div>
                        <ContentEditable
                            placeholder="在这里输入 Tags; Ctrl+Enter 添加"
                            value={text}
                            onKeyDown={(e: any) => {
                                if (e.ctrlKey && e.key === 'Enter') {
                                    batch(() => {
                                        userCollection((i) => [...i, ...stringToTags(text(), [])]);
                                        text('');
                                    });
                                }
                            }}
                        ></ContentEditable>
                    </aside>
                </Show>
            </div>
        </div>
    );
};
