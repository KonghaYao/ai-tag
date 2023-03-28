import { Component, Show, batch } from 'solid-js';
import type { BaseBlock } from '../interface';
import { TagsRow } from '../../main/UserSelected';
import { Atom, DebounceAtom, atom, reflect, resource } from '@cn-ui/use';
import { TagsToString, stringToTags } from '../../../use/TagsConvertor';
import { GlobalData } from '../../../store/GlobalData';
import { ContentEditable } from '../../../components/ContentEditable';
import type { ITagData } from '../../main/App';
import { FloatPanel } from '@cn-ui/core';
import { splitTextToAutoComplete } from './Common/splitTextToAutoComplete';
import { Transformers } from './Common/Transformers';
import copy from 'copy-to-clipboard';
import { Notice } from '../../../utils/notice';
import { ToolTips } from './Common/ToolTips';

export const TagsEditor: Component<{ block: BaseBlock }> = (props) => {
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    const userCollection = atom(stringToTags(props.block.content.text));

    const inputMode = atom(true);
    return (
        <nav class="flex items-center gap-2  rounded-xl border border-solid border-slate-600 p-2">
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
                    title="一键复制"
                    onClick={() => (
                        copy(TagsToString(userCollection())), Notice.success('复制成功')
                    )}
                >
                    📋
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
                <Transformers block={props.block}></Transformers>
            </ul>

            <div class="flex-1 transition-all">
                <TagsRow usersCollection={userCollection}></TagsRow>
                <Show when={inputMode()}>
                    <TagsSearch userCollection={userCollection}></TagsSearch>
                </Show>
            </div>
        </nav>
    );
};

export const TagsSearch = (props: { userCollection: Atom<ITagData[]> }) => {
    const text = atom('');
    const { r18Mode } = GlobalData.getApp('data');
    const infoList = resource(
        async () => {
            const [originText, q] = splitTextToAutoComplete(text());
            if (!prompt) return [];
            return fetch('https://able-hare-95.deno.dev/tags', {
                method: 'POST',
                body: JSON.stringify({
                    text: q,
                    options: {
                        filter: !r18Mode() && `r18 != 1`,
                    },
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    return res.hits as ITagData[];
                })
                .then((res) => res.map((i) => ({ ...i, originText })));
        },
        { immediately: false, initValue: [], deps: [DebounceAtom(text, 200)] }
    );
    const visible = reflect(() => !!infoList().length);
    const tooltipsProvider = reflect<{ originText: string; value: string; desc?: string }[]>(() =>
        infoList().map((i) => ({
            originText: i.originText,
            value: i.en,
            desc: i.cn,
        }))
    );
    return (
        <FloatPanel
            class="flex h-full w-full items-center rounded-md py-1"
            disabled={true}
            visible={visible}
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <aside class="max-h-[50vh] overflow-auto">
                            <ToolTips
                                onConfirm={(str) => text(str)}
                                infoList={tooltipsProvider}
                            ></ToolTips>
                        </aside>
                    </Show>
                );
            }}
        >
            <aside class="mx-2 flex w-full items-center gap-2 rounded-md  border  border-solid border-slate-600 bg-slate-800 px-2">
                <div>✒️</div>
                <input
                    class=" w-full flex-1 bg-transparent outline-none"
                    placeholder="在这里输入 Tags; Ctrl+Enter 添加"
                    value={text()}
                    oninput={(e) => text((e.target as any).value)}
                    // 避免立即删除
                    onblur={() => setTimeout(() => visible(false), 100)}
                    onKeyDown={(e: Event & any) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                            e.stopPropagation();
                            batch(() => {
                                props.userCollection((i) => [...i, ...stringToTags(text(), [])]);
                                text('');
                            });
                        }
                    }}
                ></input>
            </aside>
        </FloatPanel>
    );
};
